import { ArrowLeft, Leaf, Zap, ShieldCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

const products: (Product & { color: string; accent: string })[] = [
  {
    id: 3,
    nameAr: "آيسي راش",
    nameEn: "Icy Rush",
    descriptionAr: "انتعاش النعناع البارد القوي",
    descriptionEn: "Powerful cold mint freshness",
    flavor: "نعناع",
    strength: "١٠ ملغ",
    strengthDots: 3,
    category: "نكهة من أرضنا",
    price: "15.00",
    imageUrl: "/blue_icy_rush_nicotine_pouch_tin.webp",
    inStock: 1,
    createdAt: new Date(),
    color: "bg-emerald-50 text-emerald-900",
    accent: "text-emerald-600",
  },
  {
    id: 1,
    nameAr: "بيربل ميست",
    nameEn: "Purple Mist",
    descriptionAr: "نكهة التوت الغنية",
    descriptionEn: "Rich berry flavor",
    flavor: "توت مشكل",
    strength: "٦ ملغ",
    strengthDots: 2,
    category: "نكهات الفواكه",
    price: "15.00",
    imageUrl: "/purple_berry_nicotine_pouch_tin.webp",
    inStock: 1,
    createdAt: new Date(),
    color: "bg-purple-50 text-purple-900",
    accent: "text-purple-600",
  },
  {
    id: 5,
    nameAr: "سي سايد فروست",
    nameEn: "Seaside Frost",
    descriptionAr: "نسيم البحر البارد مع الحمضيات",
    descriptionEn: "Cool sea breeze with citrus",
    flavor: "حمضيات",
    strength: "١٠ ملغ",
    strengthDots: 3,
    category: "نكهة من أرضنا",
    price: "15.00",
    imageUrl: "/CC_FRURT.webp",
    inStock: 1,
    createdAt: new Date(),
    color: "bg-orange-50 text-orange-900",
    accent: "text-orange-600",
  },
];

export function ProductGrid() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة ${product.nameAr} إلى سلة التسوق`,
    });
  };
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2">
              مجموعتنا
            </h2>
            <p className="text-muted-foreground">
              اعثر على النكهة والقوة المثالية لك.
            </p>
          </div>
          <Button
            variant="link"
            className="hidden md:flex gap-2 text-foreground font-semibold"
          >
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${product.color}`}
              >
                {product.strength}
              </div>

              <div className="aspect-square bg-secondary/30 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-105">
                <img
                  src={product.imageUrl}
                  alt={product.nameAr}
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>

              <div className="p-6 text-right">
                <p className={`text-sm font-semibold mb-1 ${product.accent}`}>
                  {product.flavor}
                </p>
                <h3 className="text-2xl font-bold font-heading mb-2">
                  {product.nameAr}
                </h3>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-lg font-medium">١٢.٠٠ ر.س</span>
                  <Button
                    size="sm"
                    className="rounded-full px-6 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0"
                    onClick={() => handleAddToCart(product)}
                    data-testid={`button-add-cart-${product.id}`}
                  >
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    أضف للسلة
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full rounded-full">
            عرض جميع المنتجات
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "خالي من التبغ",
      description: "نيكوتين نقي ١٠٠٪ خالي من التبغ لتجربة أنظف.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "جودة عالية",
      description: "مكونات صيدلانية مصنعة وفقاً لأعلى المعايير.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "مفعول فوري",
      description: "مصممة لإطلاق النيكوتين بشكل فوري ومستمر.",
    },
  ];

  return (
    <section className="py-24 bg-secondary/30 border-y border-border/50">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
