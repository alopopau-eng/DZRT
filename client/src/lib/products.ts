export interface Product {
    id: number
    nameAr: string
    nameEn: string
    descriptionAr?: string
    descriptionEn?: string
    price?: string
    strength?: string
    strengthDots?: number
    flavor?: string
    category?: string
    imageUrl?: string
    inStock?: number
  }
  
  export const sampleProducts: Product[] = [
    {
      id: 1,
      nameAr: "بيربل مست",
      nameEn: "Purple Mist",
      descriptionAr: "نكهة التوت الغنية ممزوجة بلمسة منعشة تأخذك في رحلة.",
      descriptionEn: "Rich berry flavor with a refreshing touch.",
      price: "15.00",
      strength: "٦ ملغ",
      strengthDots: 2,
      flavor: "توت",
      category: "نكهات الفواكه",
      imageUrl: "/assets/purple_berry_nicotine_pouch_tin.webp",
      inStock: 1,
    },
    {
      id: 2,
      nameAr: "هايلاند بيري",
      nameEn: "Highland Berry",
      descriptionAr: "مزيج التوت البري المنعش مع لمسة حلاوة خفيفة.",
      descriptionEn: "Fresh berry mix with a hint of sweetness.",
      price: "15.00",
      strength: "١٠ ملغ",
      strengthDots: 3,
      flavor: "توت مشكل",
      category: "نكهات الفواكه",
      imageUrl: "/assets/red_spicy_nicotine_pouch_tin.webp",
      inStock: 1,
    },
    {
      id: 3,
      nameAr: "إيسي رش",
      nameEn: "Icy Rush",
      descriptionAr: "انتعاش النعناع البارد القوي لإحساس يدوم طويلاً.",
      descriptionEn: "Powerful cold mint freshness.",
      price: "15.00",
      strength: "١٠ ملغ",
      strengthDots: 3,
      flavor: "نعناع",
      category: "نكهة من أرضنا",
      imageUrl: "/assets/blue_icy_rush_nicotine_pouch_tin.webp",
      inStock: 1,
    },
    {
      id: 4,
      nameAr: "موخيتو",
      nameEn: "Mojito",
      descriptionAr: "نكهة الليمون والنعناع الكلاسيكية المنعشة.",
      descriptionEn: "Classic lime and mint flavor.",
      price: "15.00",
      strength: "٦ ملغ",
      strengthDots: 2,
      flavor: "ليمون ونعناع",
      category: "نكهات الفواكه",
      imageUrl: "/assets/green_mint_nicotine_pouch_tin.webp",
      inStock: 1,
    },
    {
      id: 5,
      nameAr: "سي سايد فروست",
      nameEn: "Seaside Frost",
      descriptionAr: "نسيم البحر البارد مع لمسة من الحمضيات.",
      descriptionEn: "Cool sea breeze with citrus.",
      price: "15.00",
      strength: "١٠ ملغ",
      strengthDots: 3,
      flavor: "حمضيات",
      category: "نكهة من أرضنا",
      imageUrl: "/assets/blue_icy_rush_nicotine_pouch_tin.webp",
      inStock: 1,
    },
    {
      id: 6,
      nameAr: "إيدجي منت",
      nameEn: "Edgy Mint",
      descriptionAr: "نكهة النعناع القوية والجريئة.",
      descriptionEn: "Bold and strong mint flavor.",
      price: "15.00",
      strength: "٦ ملغ",
      strengthDots: 2,
      flavor: "نعناع",
      category: "نكهة من أرضنا",
      imageUrl: "/assets/green_mint_nicotine_pouch_tin.webp",
      inStock: 1,
    },
    {
      id: 7,
      nameAr: "سمرة",
      nameEn: "Samra",
      descriptionAr: "نكهة القهوة العربية الأصيلة.",
      descriptionEn: "Authentic Arabic coffee flavor.",
      price: "15.00",
      strength: "١٠ ملغ",
      strengthDots: 3,
      flavor: "قهوة",
      category: "نكهة من أرضنا",
      imageUrl: "/assets/brown_coffee_nicotine_pouch_tin.webp",
      inStock: 1,
    },
    {
      id: 8,
      nameAr: "عنقود",
      nameEn: "Grape Cluster",
      descriptionAr: "طعم العنب الغني والعميق.",
      descriptionEn: "Rich and deep grape taste.",
      price: "15.00",
      strength: "١٠ ملغ",
      strengthDots: 3,
      flavor: "عنب",
      category: "نكهات الفواكه",
      imageUrl: "/assets/purple_berry_nicotine_pouch_tin.webp",
      inStock: 1,
    },
  ]
  