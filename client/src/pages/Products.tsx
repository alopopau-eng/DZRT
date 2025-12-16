"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Plus, Check, ShoppingCart, Star, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { type Product, sampleProducts } from "@/lib/products"
import { useCart } from "@/lib/cartContext"
import { Badge } from "@/components/ui/badge"

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([])
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const { items, addItem } = useCart()

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleStrength = (strength: string) => {
    setSelectedStrengths((prev) => (prev.includes(strength) ? prev.filter((s) => s !== strength) : [...prev, strength]))
  }

  const handleAddToCart = (product: any) => {
    addItem(product,1)

    setAddedProducts((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedProducts((prev) => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, 2000)
  }

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product!.category!)
    const matchesStrength =
      selectedStrengths.length === 0 ||
      selectedStrengths.some((str) => {
        if (str.includes("٣ ملغ")) return product.strength === "٣ ملغ"
        if (str.includes("٦ ملغ")) return product.strength === "٦ ملغ"
        if (str.includes("٧ ملغ")) return product.strength === "٧ ملغ"
        if (str.includes("١٠ ملغ")) return product.strength === "١٠ ملغ"
        return false
      })
    const matchesSearch =
      searchQuery === "" ||
      product.nameAr.includes(searchQuery) ||
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.flavor!.includes(searchQuery)
    return matchesCategory && matchesStrength && matchesSearch
  })

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-white/40" />
        <Input
          placeholder="بحث عن منتج..."
          className="bg-white/5 border-white/10 pr-10 text-right h-11 rounded-xl focus-visible:ring-primary focus-visible:border-primary/50 text-white placeholder:text-white/40"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
      >
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-bold text-sm text-white">الفئات</h4>
          {selectedCategories.length > 0 && (
            <button
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              onClick={() => setSelectedCategories([])}
            >
              مسح الكل
            </button>
          )}
        </div>
        <div className="space-y-3">
          {["الإصدارات المحدودة", "نكهة من أرضنا", "نكهات للنعناع", "نكهات الفواكه"].map((cat) => (
            <motion.div
              key={cat}
              whileHover={{ x: -5 }}
              className="flex items-center justify-end space-x-3 space-x-reverse group"
            >
              <Label
                htmlFor={`cat-${cat}`}
                className="text-sm cursor-pointer text-white/70 group-hover:text-white transition-colors"
              >
                {cat}
              </Label>
              <Checkbox
                id={`cat-${cat}`}
                className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Strength Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
      >
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-bold text-sm text-white">قوة النيكوتين</h4>
          {selectedStrengths.length > 0 && (
            <button
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              onClick={() => setSelectedStrengths([])}
            >
              مسح الكل
            </button>
          )}
        </div>
        <div className="space-y-3">
          {[
            { label: "خفيف | ٣ ملغ", dots: 1 },
            { label: "متوسط | ٦ ملغ", dots: 2 },
            { label: "متوسط | ٧ ملغ", dots: 2 },
            { label: "قوي | ١٠ ملغ", dots: 3 },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ x: -5 }}
              className="flex items-center justify-end space-x-3 space-x-reverse group"
            >
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={`str-${item.label}`}
                  className="text-sm cursor-pointer text-white/70 group-hover:text-white transition-colors"
                >
                  {item.label}
                </Label>
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i < item.dots ? "bg-primary" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Checkbox
                id={`str-${item.label}`}
                className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                checked={selectedStrengths.includes(item.label)}
                onCheckedChange={() => toggleStrength(item.label)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 bg-black/95 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-l from-white to-white/80 bg-clip-text text-transparent"
          >
            متجر المنتجات
          </motion.h1>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-white/5 border-white/20 hover:bg-white/10"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>

            <a href="/checkout">
              <Button
                variant="outline"
                className="gap-2 bg-white/5 border-white/20 hover:bg-white/10 hover:border-primary/50 transition-all"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="font-bold">{cartItemCount}</span>
                <span className="hidden sm:inline">السلة</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-24">
              <FilterSection />
            </div>
          </aside>

          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
                  onClick={() => setShowMobileFilters(false)}
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed top-0 right-0 h-full w-80 max-w-[90%] bg-black border-l border-white/10 z-50 md:hidden overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">تصفية المنتجات</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowMobileFilters(false)}
                        className="hover:bg-white/10"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <FilterSection />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20"
                  >
                    {/* Featured Badge */}
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-l from-primary to-primary/80 text-white border-0 text-xs z-10">
                        مميز
                      </Badge>
                    )}

                    {/* Product Strength & Flavor */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * i }}
                            className={`w-2 h-2 rounded-full transition-all ${
                              i < product.strengthDots! ? "bg-primary shadow-lg shadow-primary/50" : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-white/50 font-medium">
                        {product.flavor} • {product.strength}
                      </span>
                    </div>

                    {/* Product Image */}
                    <div className="relative w-full aspect-square mb-5 overflow-hidden rounded-xl bg-white/5">
                      <motion.img
                        src={product.imageUrl}
                        alt={product.nameAr}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{product.nameAr}</h3>
                        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed h-8">
                          {product.descriptionAr}
                        </p>
                      </div>

                      {/* Rating & Reviews */}
                      {product.rating && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span className="text-white/70 font-medium">{product.rating}</span>
                          </div>
                          <span className="text-white/40">({product.reviews} تقييم)</span>
                        </div>
                      )}

                      {/* Price & Add to Cart */}
                      <div className="flex items-center justify-between pt-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="icon"
                            className={`rounded-full h-11 w-11 transition-all duration-300 shadow-lg ${
                              addedProducts.has(product.id)
                                ? "bg-primary hover:bg-primary/90 text-white shadow-primary/50"
                                : "bg-white hover:bg-white/90 text-black"
                            }`}
                            onClick={() => handleAddToCart(product)}
                          >
                            <AnimatePresence mode="wait">
                              {addedProducts.has(product.id) ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                >
                                  <Check className="h-5 w-5" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="plus"
                                  initial={{ scale: 0, rotate: 180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: -180 }}
                                >
                                  <Plus className="h-5 w-5" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Button>
                        </motion.div>

                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-l from-white to-white/80 bg-clip-text text-transparent">
                            {product.price!}
                          </p>
                          <p className="text-xs text-white/40">ر.س</p>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="pt-2 border-t border-white/5">
                        <p
                          className={`text-xs ${
                            product.inStock! > 50
                              ? "text-green-400"
                              : product.inStock! > 20
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {product?.inStock! > 50 ? "الأكثر طلباً" : product.inStock! > 20 ? "كمية محدودة" : "ينفذ قريباً"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 px-4"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Search className="h-12 w-12 text-white/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2">لا توجد منتجات</h3>
                <p className="text-white/50 text-center max-w-md mb-6">
                  لم نجد أي منتجات تطابق معايير البحث. جرب تغيير الفلاتر أو البحث بكلمات أخرى.
                </p>
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/20"
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectedStrengths([])
                    setSearchQuery("")
                  }}
                >
                  إعادة تعيين الفلاتر
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
