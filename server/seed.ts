import { db } from "./db";
import { products } from "@shared/schema";

const sampleProducts = [
  {
    nameAr: "بيربل مست",
    nameEn: "Purple Mist",
    descriptionAr: "نكهة التوت الغنية ممزوجة بلمسة منعشة تأخذك في رحلة.",
    descriptionEn: "Rich berry flavor with a refreshing touch.",
    price: "15.00",
    strength: "٦ ملغ",
    strengthDots: 2,
    flavor: "توت",
    category: "نكهات الفواكه",
    imageUrl: "/purple_berry_nicotine_pouch_tin.webp",
    inStock: 1,
  },
  {
    nameAr: "هايلاند بيري",
    nameEn: "Highland Berry",
    descriptionAr: "مزيج التوت البري المنعش مع لمسة حلاوة خفيفة.",
    descriptionEn: "Fresh berry mix with a hint of sweetness.",
    price: "15.00",
    strength: "١٠ ملغ",
    strengthDots: 3,
    flavor: "توت مشكل",
    category: "نكهات الفواكه",
    imageUrl: "/red_spicy_nicotine_pouch_tin.webp",
    inStock: 1,
  },
  {
    nameAr: "إيسي رش",
    nameEn: "Icy Rush",
    descriptionAr: "انتعاش النعناع البارد القوي لإحساس يدوم طويلاً.",
    descriptionEn: "Powerful cold mint freshness.",
    price: "15.00",
    strength: "١٠ ملغ",
    strengthDots: 3,
    flavor: "نعناع",
    category: "نكهة من أرضنا",
    imageUrl: "/blue_icy_rush_nicotine_pouch_tin.webp",
    inStock: 1,
  },
  {
    nameAr: "موخيتو",
    nameEn: "Mojito",
    descriptionAr: "نكهة الليمون والنعناع الكلاسيكية المنعشة.",
    descriptionEn: "Classic lime and mint flavor.",
    price: "15.00",
    strength: "٦ ملغ",
    strengthDots: 2,
    flavor: "ليمون ونعناع",
    category: "نكهات الفواكه",
    imageUrl: "/green_mint_nicotine_pouch_tin.webp",
    inStock: 1,
  },
  {
    nameAr: "سي سايد فروست",
    nameEn: "Seaside Frost",
    descriptionAr: "نسيم البحر البارد مع لمسة من الحمضيات.",
    descriptionEn: "Cool sea breeze with citrus.",
    price: "15.00",
    strength: "١٠ ملغ",
    strengthDots: 3,
    flavor: "حمضيات",
    category: "نكهة من أرضنا",
    imageUrl: "/CC_FRURT.webp",
    inStock: 1,
  },
  {
    nameAr: "إيدجي منت",
    nameEn: "Edgy Mint",
    descriptionAr: "نكهة النعناع القوية والجريئة.",
    descriptionEn: "Bold and strong mint flavor.",
    price: "15.00",
    strength: "٦ ملغ",
    strengthDots: 2,
    flavor: "نعناع",
    category: "نكهة من أرضنا",
    imageUrl: "/EDGE_MINT.webp",
    inStock: 1,
  },
  {
    nameAr: "سمرة",
    nameEn: "Samra",
    descriptionAr: "نكهة القهوة العربية الأصيلة.",
    descriptionEn: "Authentic Arabic coffee flavor.",
    price: "15.00",
    strength: "١٠ ملغ",
    strengthDots: 3,
    flavor: "قهوة",
    category: "نكهة من أرضنا",
    imageUrl: "/SAMRA.webp",
    inStock: 1,
  },
  {
    nameAr: "عنقود",
    nameEn: "Grape Cluster",
    descriptionAr: "طعم العنب الغني والعميق.",
    descriptionEn: "Rich and deep grape taste.",
    price: "15.00",
    strength: "١٠ ملغ",
    strengthDots: 3,
    flavor: "عنب",
    category: "نكهات الفواكه",
    imageUrl: "/ankod.webp",
    inStock: 1,
  },
  {
    nameAr: "بلاك بيست",
    nameEn: "Black Beast",
    descriptionAr: "نكهة قوية وجريئة بلمسة داكنة لمحبي الإحساس العميق.",
    descriptionEn: "Strong and bold dark flavor.",
    price: "15.00",
    strength: "١٠ ملغ",
    strengthDots: 3,
    flavor: "داكن",
    category: "نكهة من أرضنا",
    imageUrl: "/BLACK_BEAST.webp",
    inStock: 1,
  },
  {
    nameAr: "هايلاند منت",
    nameEn: "Highland Mint",
    descriptionAr: "نعناع متوازن بنكهة منعشة تدوم طويلاً.",
    descriptionEn: "Balanced mint with lasting freshness.",
    price: "15.00",
    strength: "٦ ملغ",
    strengthDots: 2,
    flavor: "نعناع",
    category: "نكهة من أرضنا",
    imageUrl: "/HIGHLAND_MINT.webp",
    inStock: 1,
  },
  {
    nameAr: "فريش سبيرمنت",
    nameEn: "Fresh Spearmint",
    descriptionAr: "انتعاش السبيرمنت الطبيعي بنكهة نظيفة وخفيفة.",
    descriptionEn: "Clean and light natural spearmint flavor.",
    price: "15.00",
    strength: "٦ ملغ",
    strengthDots: 2,
    flavor: "سبيرمنت",
    category: "نكهة من أرضنا",
    imageUrl: "/FRESH_SPEARMINT.webp",
    inStock: 1,
  },
  {
    nameAr: "منت فيوجن",
    nameEn: "Mint Fusion",
    descriptionAr: "مزيج فريد من النعناع يمنح إحساساً منعشاً وقوياً.",
    descriptionEn: "Unique mint blend with powerful freshness.",
    price: "15.00",
    strength: "١٠ ملغ",
    strengthDots: 3,
    flavor: "نعناع",
    category: "نكهة من أرضنا",
    imageUrl: "/MINT_FUSION.webp",
    inStock: 1,
  },
  {
    nameAr: "تمرة",
    nameEn: "Limera",
    descriptionAr: "مزيج منعش من الليمون بلمسة عصرية.",
    descriptionEn: "Refreshing lemon blend with a modern twist.",
    price: "15.00",
    strength: "٦ ملغ",
    strengthDots: 2,
    flavor: "ليمون",
    category: "نكهات الفواكه",
    imageUrl: "/LIMERA.webp",
    inStock: 1,
  },
  {
    nameAr: "بُنّة",
    nameEn: "Bunna",
    descriptionAr: "قهوة غنية بنكهة دافئة لمحبي الطابع الكلاسيكي.",
    descriptionEn: "Rich coffee flavor with a warm classic touch.",
    price: "15.00",
    strength: "١٠ ملغ",
    strengthDots: 3,
    flavor: "قهوة",
    category: "نكهة من أرضنا",
    imageUrl: "/BUNNA.webp",
    inStock: 1,
  },
  
];

async function seed() {
  console.log("Seeding database...");
  
  try {
    // Insert all products
    await db.insert(products).values(sampleProducts);
    console.log("✓ Successfully seeded products");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
