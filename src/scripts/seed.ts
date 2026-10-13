/**
 * Populates the database from src/data/categories.ts and src/data/products.ts,
 * and creates the first admin user from ADMIN_EMAIL / ADMIN_PASSWORD.
 *
 * Existing category and product rows are left unchanged.
 * Do not run against a populated production database unless you intend to seed it.
 * Run with: npm run db:seed
 */
import "dotenv/config";

import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { hashPassword } from "@/lib/auth-password";
import { countAdmins, createAdmin, getAdminByEmail } from "@/lib/db/admin";
import { newId, sql } from "@/lib/db/client";

async function seedCategories(): Promise<Map<string, string>> {
  const idBySlug = new Map<string, string>();

  for (const [i, category] of CATEGORIES.entries()) {
    const existing = await sql<{ id: string }[]>`
      SELECT id
      FROM categories
      WHERE slug = ${category.slug}
      LIMIT 1
    `;

    if (existing[0]) {
      idBySlug.set(category.slug, existing[0].id);
      continue;
    }

    const id = newId();

    await sql`
      INSERT INTO categories (
        id, slug, name, tagline, description, origin, uses,
        material, width, care, pattern, unit_name, unit_plural,
        unit_min, unit_max, unit_default, sort_order
      )
      VALUES (
        ${id},
        ${category.slug},
        ${category.name},
        ${category.tagline},
        ${category.description},
        ${category.origin},
        ${JSON.stringify(category.uses)},
        ${category.material},
        ${category.width},
        ${category.care},
        ${category.pattern},
        ${category.unit.name},
        ${category.unit.plural},
        ${category.unit.min},
        ${category.unit.max},
        ${category.unit.defaultQty},
        ${i}
      )
    `;

    idBySlug.set(category.slug, id);
  }

  return idBySlug;
}

async function seedProducts(idBySlug: Map<string, string>): Promise<number> {
  let created = 0;

  for (const product of PRODUCTS) {
    const categoryId = idBySlug.get(product.categorySlug);
    if (!categoryId) continue;

    const existing = await sql<{ id: string }[]>`
      SELECT id
      FROM products
      WHERE slug = ${product.slug}
      LIMIT 1
    `;

    if (existing[0]) continue;

    await sql`
      INSERT INTO products (
        id, slug, name, category_id, price, colors, description,
        badge, featured, stock, active, gallery
      )
      VALUES (
        ${newId()},
        ${product.slug},
        ${product.name},
        ${categoryId},
        ${product.price},
        ${JSON.stringify(product.colors)},
        ${product.description},
        ${product.badge},
        ${product.featured ? 1 : 0},
        ${25},
        ${1},
        ${"[]"}
      )
    `;

    created++;
  }

  return created;
}

async function seedAdmin(): Promise<boolean> {
  const email = process.env.ADMIN_EMAIL ?? "admin@ankora.ng";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  if (await getAdminByEmail(email)) return false;

  if ((await countAdmins()) > 0 && !process.env.ADMIN_EMAIL) {
    return false;
  }

  const hash = await hashPassword(password);
  await createAdmin(email, hash, "Ankora Admin");

  console.log(
    `Admin user created: ${email}. Ensure ADMIN_PASSWORD is securely configured before going live.`,
  );

  return true;
}

async function main() {
  const idBySlug = await seedCategories();
  const createdProducts = await seedProducts(idBySlug);
  const createdAdmin = await seedAdmin();

  console.log(
    `Seed complete. Categories: ${idBySlug.size}. New products: ${createdProducts}. Admin created: ${createdAdmin}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
