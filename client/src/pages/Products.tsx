import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, ShoppingBag, Loader2, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cartContext";
import { toast } from "sonner";
import type { Product } from "@shared/schema";

export const imageMap: Record<string, string> = {
  "/assets/purple_berry_nicotine_pouch_tin.webp": "/purple_berry_nicotine_pouch_tin.webp",
  "/assets/blue_icy_rush_nicotine_pouch_tin.webp": "/blue_icy_rush_nicotine_pouch_tin.webp",
  "/assets/green_mint_nicotine_pouch_tin.webp": "/green_mint_nicotine_pouch_tin.webp",
  "/assets/red_spicy_nicotine_pouch_tin.webp": "/red_spicy_nicotine_pouch_tin.webp",
  "/assets/brown_coffee_nicotine_pouch_tin.webp": "/brown_coffee_nicotine_pouch_tin.webp",
  "/assets/CC_FRURT.webp": "/CC_FRURT.webp",
  "/assets/EDGE_MINT.webp": "/EDGE_MINT.webp",
  "/assets/SAMRA.webp": "/SAMRA.webp",
  "/assets/ankod.webp": "/ankod.webp",
  "/assets/BLACK_BEAST.webp": "/purple_berry_nicotine_pouch_tin.webp",
  "/assets/HIGHLAND_MINT.webp": "/green_mint_nicotine_pouch_tin.webp",
  "/assets/FRESH_SPEARMINT.webp": "/FRESH_SPEARMINT.webp",
  "/assets/MINT_FUSION.webp": "/MINT_FUSION.webp",
  "/assets/LIMERA.webp": "/LIMERA.webp",
  "/assets/BUNNA.webp": "/BUNNA.webp",
};

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());
  const { addItem } = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json() as Promise<Product[]>;
    },
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleStrength = (strength: string) => {
    setSelectedStrengths(prev => 
      prev.includes(strength) ? prev.filter(s => s !== strength) : [...prev, strength]
    );
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedProducts(prev => new Set(prev).add(product.id));
    toast.success(
      <div className="flex items-center gap-3 text-right" dir="rtl">
        <span>تمت إضافة <strong>{product.nameAr}</strong> إلى السلة</span>
      </div>
    );
    setTimeout(() => {
      setAddedProducts(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-32 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="flex-1 md:order-1">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-transparent rounded-xl p-4 flex flex-col items-center text-center relative hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    data-testid={`card-product-${product.id}`}
                  >
                    <div className="w-full flex justify-between items-start text-xs text-white/50 mb-4 px-2">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full ${i < product.strengthDots ? 'bg-white' : 'bg-white/20'}`}
                          />
                        ))}
                      </div>
                      <span>{product.flavor} {product.strength}</span>
                    </div>

                    <div className="relative w-48 h-48 mb-6 transition-transform duration-500 group-hover:scale-105">
                      <img 
                        src={imageMap[product.imageUrl] || "/purple_berry_nicotine_pouch_tin.webp"} 
                        alt={product.nameAr}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>

                    <h3 className="text-xl font-bold font-heading mb-2" data-testid={`text-product-name-${product.id}`}>{product.nameAr}</h3>
                    <p className="text-white/60 text-xs leading-relaxed mb-6 h-10 overflow-hidden">
                      {product.descriptionAr}
                    </p>

                    <div className="w-full flex items-center justify-between px-2 mt-auto">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={`rounded-full border-0 h-10 w-10 transition-all duration-300 ${
                          addedProducts.has(product.id) 
                            ? 'bg-primary text-white' 
                            : 'bg-white text-black hover:bg-white/90'
                        }`}
                        onClick={() => handleAddToCart(product)}
                        data-testid={`button-add-cart-${product.id}`}
                      >
                        {addedProducts.has(product.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="font-bold text-lg" data-testid={`text-product-price-${product.id}`}>{parseFloat(product.price).toFixed(2)} ر.س</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-64 md:order-2 shrink-0">
            <div className="sticky top-24 space-y-8">
              
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-white/50" />
                <Input 
                  placeholder="بحث..." 
                  className="bg-transparent border-white/20 pr-10 text-right h-10 rounded-lg focus-visible:ring-primary"
                  data-testid="input-search"
                />
              </div>

              <div className="bg-transparent border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm">فرز حسب الفئات</h4>
                  <button className="text-xs text-white/50 hover:text-white" data-testid="button-clear-categories">مسح الكل</button>
                </div>
                <div className="space-y-4">
                  {["الإصدارات المحدودة", "نكهة من أرضنا", "نكهات للنعناع", "نكهات الفواكه"].map((cat) => (
                    <div key={cat} className="flex items-center justify-end space-x-3 space-x-reverse">
                      <Label htmlFor={`cat-${cat}`} className="text-sm font-light cursor-pointer text-white/80">{cat}</Label>
                      <Checkbox 
                        id={`cat-${cat}`} 
                        className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-transparent border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm">قوة النيكوتين</h4>
                  <button className="text-xs text-white/50 hover:text-white" data-testid="button-clear-strength">مسح الكل</button>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "خفيف | ٣ ملغ", dots: 1 },
                    { label: "متوسط | ٦ ملغ", dots: 2 },
                    { label: "متوسط | ٧ ملغ", dots: 2 },
                    { label: "قوي | ١٠ ملغ", dots: 3 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-end space-x-3 space-x-reverse">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`str-${item.label}`} className="text-sm font-light cursor-pointer text-white/80">{item.label}</Label>
                        <div className="flex gap-0.5">
                           {[...Array(3)].map((_, i) => (
                              <div key={i} className={`w-1 h-1 rounded-full ${i < item.dots ? 'bg-white' : 'bg-white/20'}`} />
                           ))}
                        </div>
                      </div>
                      <Checkbox 
                        id={`str-${item.label}`}
                         className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                         checked={selectedStrengths.includes(item.label)}
                         onCheckedChange={() => toggleStrength(item.label)}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
