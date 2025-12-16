import { Link } from "wouter";
import { ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cartContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full border border-white/20" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-white/10 text-white">
              <div className="flex flex-col gap-6 mt-10 text-right">
                <Link href="/" className="text-xl font-medium hover:text-primary transition-colors" data-testid="link-home">الرئيسية</Link>
                <Link href="/products" className="text-xl font-medium hover:text-primary transition-colors" data-testid="link-products">المنتجات</Link>
                <Link href="/about" className="text-xl font-medium hover:text-primary transition-colors" data-testid="link-about">قصتنا</Link>
                <Link href="/support" className="text-xl font-medium hover:text-primary transition-colors" data-testid="link-support">الدعم</Link>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/checkout">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full border border-white/20 relative" data-testid="button-cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full text-[10px] font-bold flex items-center justify-center text-white" data-testid="text-cart-count">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

        <Link href="/">
          <span className="text-3xl font-bold font-heading tracking-tighter text-white cursor-pointer" data-testid="link-logo">دزرت</span>
        </Link>
      </div>
    </nav>
  );
}
