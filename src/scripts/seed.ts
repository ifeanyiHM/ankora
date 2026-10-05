/**
 * Populates the database from src/data/categories.ts and src/data/products.ts, and creates the
 * first admin user from ADMIN_EMAIL / ADMIN_PASSWORD (or the defaults below, for local dev only).
 * Safe to run more than once: existing rows are left alone.
 * Run with: npm run db:seed
 */
import "dotenv/config";
import { db, newId } from "@/lib/db/client";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { countAdmins, createAdmin, getAdminByEmail } from "@/lib/db/admin";
import { hashPassword } from "@/lib/auth-password";

function seedCategories(): Map<string, string> {
  const idBySlug = new Map<string, string>();
  const insert = db.prepare(
    `INSERT INTO categories (id, slug, name, tagline, description, origin, uses, material, width, care, pattern, unit_name, unit_plural, unit_min, unit_max, unit_default, sort_order)
     VALUES (@id, @slug, @name, @tagline, @description, @origin, @uses, @material, @width, @care, @pattern, @unitName, @unitPlural, @unitMin, @unitMax, @unitDefault, @sortOrder)`,
  );
  CATEGORIES.forEach((c, i) => {
    const existing = db.prepare<[string], { id: string }>("SELECT id FROM categories WHERE slug = ?").get(c.slug);
    if (existing) { idBySlug.set(c.slug, existing.id); return; }
    const id = newId();
    insert.run({
      id, slug: c.slug, name: c.name, tagline: c.tagline, description: c.description, origin: c.origin,
      uses: JSON.stringify(c.uses), material: c.material, width: c.width, care: c.care, pattern: c.pattern,
      unitName: c.unit.name, unitPlural: c.unit.plural, unitMin: c.unit.min, unitMax: c.unit.max, unitDefault: c.unit.defaultQty,
      sortOrder: i,
    });
    idBySlug.set(c.slug, id);
  });
  return idBySlug;
}

function seedProducts(idBySlug: Map<string, string>) {
  const insert = db.prepare(
    `INSERT INTO products (id, slug, name, category_id, price, colors, description, badge, featured, stock, active, gallery)
     VALUES (@id, @slug, @name, @categoryId, @price, @colors, @description, @badge, @featured, @stock, 1, '[]')`,
  );
  let created = 0;
  for (const p of PRODUCTS) {
    const categoryId = idBySlug.get(p.categorySlug);
    if (!categoryId) continue;
    const existing = db.prepare("SELECT 1 FROM products WHERE slug = ?").get(p.slug);
    if (existing) continue;
    insert.run({
      id: newId(), slug: p.slug, name: p.name, categoryId, price: p.price, colors: JSON.stringify(p.colors),
      description: p.description, badge: p.badge, featured: p.featured ? 1 : 0, stock: 25,
    });
    created++;
  }
  return created;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@ankora.ng";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  if (getAdminByEmail(email)) return false;
  if (countAdmins() > 0 && !process.env.ADMIN_EMAIL) return false; // don't create a second default admin
  const hash = await hashPassword(password);
  createAdmin(email, hash, "Ankora Admin");
  console.log(`Admin user created: ${email} / ${password} — please sign in and change this password's source (ADMIN_PASSWORD) before going live.`);
  return true;
}

async function main() {
  const idBySlug = seedCategories();
  const createdProducts = seedProducts(idBySlug);
  const createdAdmin = await seedAdmin();
  console.log(`Seed complete. Categories: ${idBySlug.size}. New products: ${createdProducts}. Admin created: ${createdAdmin}.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
