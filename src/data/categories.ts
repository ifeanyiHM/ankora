import type { FabricPattern, SellingUnit } from "@/types";

/** Seed-only shape: what the seed script needs to create a row in the categories table. */
export interface SeedCategory {
  slug: string; name: string; tagline: string; description: string; origin: string;
  uses: string[]; material: string; width: string; care: string; pattern: FabricPattern; unit: SellingUnit;
}

const yard = (defaultQty: number): SellingUnit => ({ name: "yard", plural: "yards", min: 1, max: 60, defaultQty });
const piece = (name: string, plural: string, defaultQty = 1, max = 12): SellingUnit => ({ name, plural, min: 1, max, defaultQty });

/**
 * The 14 fabric families, used once by the seed script (npm run db:seed) to populate the database.
 * After seeding, edit categories from the admin dashboard instead of this file.
 */
export const CATEGORIES: SeedCategory[] = [
  {
    slug: "aso-oke", name: "Aso Oke", pattern: "aso-oke",
    tagline: "Handwoven strip cloth for weddings and ceremonies",
    description: "Handwoven Yoruba textile, commonly used for weddings, ceremonies, caps, and traditional outfits. Narrow strips are woven on a loom, then sewn together into wide cloth.",
    origin: "Yoruba, south-west Nigeria",
    uses: ["Weddings", "Naming ceremonies", "Gele and fila caps", "Aso ebi"],
    material: "Cotton and silk-blend thread, some with metallic weft", width: "Sold as a set of pieces", care: "Dry clean or hand wash cold, iron on low",
    unit: piece("set", "sets"),
  },
  {
    slug: "adire", name: "Adire", pattern: "adire",
    tagline: "Indigo resist-dyed cloth from Abeokuta and Ibadan",
    description: "Yoruba indigo-dyed textile, traditionally made using tie-dye and resist-dye techniques. Every pattern is made by binding, stitching or painting the cloth before it goes into the dye.",
    origin: "Yoruba, Abeokuta and Ibadan",
    uses: ["Wrappers and skirts", "Shirts and kaftans", "Head wraps", "Home textiles"],
    material: "100% cotton, indigo dyed", width: "About 44 inches", care: "Hand wash cold alone for the first washes, dry in shade",
    unit: yard(5),
  },
  {
    slug: "akwete", name: "Akwete", pattern: "akwete",
    tagline: "Igbo weaving from Akwete, Abia State",
    description: "Handwoven Igbo textile traditionally associated with the Akwete community in Abia State. Dense geometric motifs are woven into the cloth on a horizontal loom.",
    origin: "Igbo, Akwete in Abia State",
    uses: ["Ceremonial wear", "Wrappers", "Home décor", "Accessories"],
    material: "Cotton and rayon thread, handwoven", width: "About 36 inches", care: "Dry clean recommended",
    unit: yard(4),
  },
  {
    slug: "george", name: "George", pattern: "george",
    tagline: "Richly embroidered wrappers for ceremonies",
    description: "A richly decorated fabric commonly worn for traditional ceremonies, especially in southern Nigeria. Sold as a wrapper piece with embroidery, beading or sequin work.",
    origin: "Southern Nigeria, worn across the Niger Delta and the south-east",
    uses: ["Traditional weddings", "Wrappers", "Blouses and gowns"],
    material: "Cotton-blend with embroidered and beaded finish", width: "About 48 inches", care: "Dry clean only",
    unit: piece("5-yard piece", "5-yard pieces"),
  },
  {
    slug: "ankara", name: "Ankara", pattern: "ankara",
    tagline: "Bold printed cotton for everyday and occasion wear",
    description: "Colorful printed cotton fabric widely used across Nigeria for dresses, shirts, skirts, and traditional outfits.",
    origin: "Wax-print tradition, worn across West Africa",
    uses: ["Dresses and skirts", "Shirts", "Aso ebi", "Bags and accessories"],
    material: "100% cotton, wax print", width: "About 45 inches", care: "Machine wash cold, iron on the reverse",
    unit: piece("6-yard piece", "6-yard pieces"),
  },
  {
    slug: "atiku", name: "Atiku", pattern: "atiku",
    tagline: "Light embroidered cloth for men's outfits",
    description: "A lightweight, often embroidered fabric commonly used for men's traditional outfits. It drapes well and stays cool in warm weather.",
    origin: "Northern and south-western Nigeria",
    uses: ["Men's kaftans", "Buba and sokoto", "Traditional caps"],
    material: "Cotton-blend, lightly embroidered", width: "About 58 inches", care: "Hand wash gently, iron on medium",
    unit: yard(5),
  },
  {
    slug: "hollandais", name: "Hollandais", pattern: "hollandais",
    tagline: "Premium double-sided wax print",
    description: "High-quality wax-print fabric commonly used for Nigerian traditional clothing. The design shows clearly on both sides and the colors hold for years.",
    origin: "Dutch-designed wax print, treasured across West Africa",
    uses: ["Occasion dresses", "Aso ebi", "Head ties", "Statement outfits"],
    material: "100% cotton, wax resist printed", width: "About 46 inches", care: "Hand wash cold, do not bleach",
    unit: piece("6-yard piece", "6-yard pieces"),
  },
  {
    slug: "lace", name: "Lace", pattern: "lace",
    tagline: "French, cord, Swiss voile and beaded lace",
    description: "Decorative openwork fabric widely used for aso ebi, blouses, gowns, and men's traditional outfits.",
    origin: "Imported and embroidered lace, staple of Nigerian celebrations",
    uses: ["Aso ebi", "Blouses and gowns", "Wedding outfits", "Men's traditional wear"],
    material: "Polyester and cotton-blend, some with beads or stones", width: "About 50 inches", care: "Dry clean or hand wash with care",
    unit: piece("5-yard bundle", "5-yard bundles"),
  },
  {
    slug: "guinea-brocade", name: "Guinea Brocade", pattern: "guinea-brocade",
    tagline: "Crisp woven cloth for agbada and kaftans",
    description: "A woven fabric commonly used for agbada, kaftans, and other traditional men's clothing. Known for its crisp hand and subtle sheen.",
    origin: "Popular across Nigeria and the Sahel",
    uses: ["Agbada", "Kaftans", "Men's two-piece outfits"],
    material: "Cotton-blend with pressed finish", width: "About 56 inches", care: "Dry clean or cool hand wash, press on low",
    unit: yard(5),
  },
  {
    slug: "damask", name: "Damask", pattern: "damask",
    tagline: "Tone-on-tone woven patterns",
    description: "Patterned woven fabric frequently used for Nigerian men's traditional wear. The design is woven into the cloth, so it never fades or washes out.",
    origin: "Woven damask, a favourite for formal men's wear",
    uses: ["Men's traditional outfits", "Agbada", "Home furnishing"],
    material: "Cotton and polyester weave", width: "About 58 inches", care: "Dry clean recommended",
    unit: yard(5),
  },
  {
    slug: "velvet", name: "Velvet", pattern: "velvet",
    tagline: "Soft-pile fabric for ceremonial outfits",
    description: "Soft fabric commonly used for traditional ceremonial outfits and accessories. Deep colours and a rich pile catch the light.",
    origin: "Worn across Nigeria for weddings and festive occasions",
    uses: ["Ceremonial outfits", "Caps and bags", "Gowns", "Upholstery"],
    material: "Polyester and cotton-blend pile", width: "About 58 inches", care: "Dry clean only, steam to lift the pile",
    unit: yard(3),
  },
  {
    slug: "senator-material", name: "Senator Material", pattern: "senator",
    tagline: "Clean plain and twill cloth for senator outfits",
    description: "Plain or subtly patterned fabric commonly used for Nigerian men's senator-style outfits. Smooth, breathable and easy to tailor.",
    origin: "Named for the senator-style outfit worn across Nigeria",
    uses: ["Senator outfits", "Office and formal wear", "Trousers and shirts"],
    material: "Cotton-blend twill", width: "About 58 inches", care: "Machine wash cold, iron medium",
    unit: yard(4),
  },
  {
    slug: "brocade", name: "Brocade", pattern: "brocade",
    tagline: "Metallic woven motifs for agbada and ceremony",
    description: "Decorative woven fabric used extensively for agbada, kaftans, and ceremonial clothing. Raised motifs, often in metallic thread, give it weight and sparkle.",
    origin: "Loved across Nigeria for ceremonial wear",
    uses: ["Agbada", "Kaftans", "Ceremonial outfits", "Women's gowns"],
    material: "Polyester and cotton-blend with metallic thread", width: "About 56 inches", care: "Dry clean recommended",
    unit: yard(5),
  },
  {
    slug: "kente", name: "Kente", pattern: "kente",
    tagline: "Strip-woven cloth of kings and celebrations",
    description: "Originally associated with Ghana, but also widely worn in Nigeria, particularly for ceremonial and traditional outfits. Bright woven strips are joined into bold geometric cloth.",
    origin: "Ashanti and Ewe weaving traditions, worn across West Africa",
    uses: ["Graduations", "Ceremonial outfits", "Stoles and sashes", "Traditional weddings"],
    material: "Cotton and rayon thread, strip woven", width: "Sold as a full cloth", care: "Hand wash cold or dry clean, store folded flat",
    unit: piece("piece", "pieces"),
  },
];
