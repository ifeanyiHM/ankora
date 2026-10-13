import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });

async function main() {
  const connectionString =
    process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Database connection URL is missing.");
  }

  const sql = postgres(connectionString, {
    max: 1,
    connect_timeout: 15,
    prepare: false,
  });

  try {
    const result = await sql.unsafe(
      "SELECT current_database() AS db, current_user AS usr",
    );

    console.log("Database connection successful:", {
      database: result[0].db,
      user: result[0].usr,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Test failed:", error.message);
  process.exitCode = 1;
});
