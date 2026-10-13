import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import postgres from "postgres";
dotenv.config({ path: ".env.local" });

async function main() {
  const connectionString =
    process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  const newEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const newPassword = process.env.ADMIN_PASSWORD;

  if (!connectionString || !newEmail || !newPassword) {
    throw new Error(
      "Set DATABASE_URL (or DATABASE_URL_UNPOOLED), ADMIN_EMAIL, and ADMIN_PASSWORD in .env.local.",
    );
  }

  if (newPassword.length < 12) {
    throw new Error("Use a new password with at least 12 characters.");
  }

  const sql = postgres(connectionString, {
    max: 1,
    connect_timeout: 15,
    prepare: false,
  });

  try {
    const admins = await sql<{ id: string; email: string }[]>`
      SELECT id, email
      FROM admin_users
      ORDER BY created_at ASC
    `;

    if (admins.length === 0) {
      throw new Error(
        "No admin account exists. This script updates an existing account only.",
      );
    }

    // If there is only one admin, update that account.
    // If there are multiple, set ADMIN_CURRENT_EMAIL to identify the account.
    const currentEmail = process.env.ADMIN_CURRENT_EMAIL?.trim().toLowerCase();

    let admin: { id: string; email: string } | undefined;

    if (currentEmail) {
      admin = admins.find((item) => item.email.toLowerCase() === currentEmail);
      if (!admin) {
        throw new Error(
          "ADMIN_CURRENT_EMAIL does not match an existing admin.",
        );
      }
    } else if (admins.length === 1) {
      admin = admins[0];
    } else {
      throw new Error(
        "Multiple admin accounts exist. Set ADMIN_CURRENT_EMAIL to the account you want to update.",
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE admin_users
      SET email = ${newEmail},
          password_hash = ${passwordHash}
      WHERE id = ${admin.id}
    `;

    console.log(`Admin credentials updated successfully for ${newEmail}.`);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Admin update failed:", error.message);
  process.exitCode = 1;
});
