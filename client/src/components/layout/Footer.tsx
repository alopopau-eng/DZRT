import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 border-t border-white/10">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-right">
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <a className="text-3xl font-bold font-heading tracking-tighter mb-6 block">DZRT</a>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mr-auto ml-0">
              أكياس نيكوتين فاخرة مصممة لنمط الحياة العصري. خالية من التبغ، خالية من الدخان، خالية من المتاعب.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/40">التسوق</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li><Link href="/products"><a className="hover:text-white transition-colors">جميع المنتجات</a></Link></li>
              <li><Link href="/products/mint"><a className="hover:text-white transition-colors">نعناع</a></Link></li>
              <li><Link href="/products/fruit"><a className="hover:text-white transition-colors">فواكه</a></Link></li>
              <li><Link href="/bundles"><a className="hover:text-white transition-colors">الباقات</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/40">الشركة</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li><Link href="/about"><a className="hover:text-white transition-colors">قصتنا</a></Link></li>
              <li><Link href="/blog"><a className="hover:text-white transition-colors">المدونة</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-white transition-colors">تواصل معنا</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-white/40">قانوني</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li><Link href="/privacy"><a className="hover:text-white transition-colors">سياسة الخصوصية</a></Link></li>
              <li><Link href="/terms"><a className="hover:text-white transition-colors">الشروط والأحكام</a></Link></li>
              <li><Link href="/shipping"><a className="hover:text-white transition-colors">سياسة الشحن</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>&copy; ٢٠٢٤ DZRT. جميع الحقوق محفوظة.</p>
          <p>تحذير: هذا المنتج يحتوي على النيكوتين. النيكوتين مادة كيميائية تسبب الإدمان.</p>
        </div>
      </div>
    </footer>
  );
}
