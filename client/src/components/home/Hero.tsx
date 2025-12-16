import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Percent, Sparkles, Shield, Truck } from "lucide-react";
import { Link } from "wouter";

export function Hero() {
  return (
    <section className="relative w-full bg-black pt-24 pb-12 overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-30" />
      
      <div className="container relative z-10 px-4 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-white mb-4">
            اكتشف تجربة <span className="text-primary">DZRT</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            أكياس نيكوتين فاخرة بنكهات سعودية أصيلة
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl mx-auto mb-10"
        >
          <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <div className="absolute -top-3 right-6 bg-primary text-white text-sm font-bold px-4 py-1 rounded-full">
              عرض خاص
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Link href="/products">
                <Button size="lg" className="font-bold gap-2 text-lg px-8 py-6" data-testid="button-hero-shop">
                  تسوق الآن
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-3xl md:text-5xl font-bold text-white">خصم ٢٠٪</p>
                  <p className="text-white/60 text-base md:text-lg">على جميع المنتجات</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Percent className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-6xl mx-auto mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 rounded-2xl" />
          <img 
            src="/hero-banner.webp" 
            alt="DZRT Collection" 
            className="w-full h-auto object-contain rounded-2xl shadow-2xl shadow-black/50"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl"
        >
          <div className="flex items-center justify-center gap-3 text-white/80 bg-white/5 rounded-xl px-4 py-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">نكهات سعودية أصيلة</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-white/80 bg-white/5 rounded-xl px-4 py-3">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">توصيل سريع</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-white/80 bg-white/5 rounded-xl px-4 py-3">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">جودة مضمونة</span>
          </div>
        </motion.div>

      </div>
      
    </section>
  );
}
