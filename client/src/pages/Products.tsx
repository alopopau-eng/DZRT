"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Plus, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Product, sampleProducts } from "@/lib/products"
import { useCart } from "@/lib/cartContext"


export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([])
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([])
 const {addItem}=useCart()
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleStrength = (strength: string) => {
    setSelectedStrengths((prev) => (prev.includes(strength) ? prev.filter((s) => s !== strength) : [...prev, strength]))
  }

  const handleAddToCart = (product: any) => {
    addItem(product,cart.length)
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })

    setAddedProducts((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedProducts((prev) => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, 1500)
  }

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product?.category as any)
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
      product!.flavor!.includes(searchQuery)
    return matchesCategory && matchesStrength && matchesSearch
  })

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 bg-black/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">متجر المنتجات</h1>
          <a href="/checkout">
            <Button variant="outline" className="gap-2 bg-transparent">
              <span className="font-bold">{cartItemCount}</span>
              السلة
            </Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Products Grid */}
          <div className="flex-1 md:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-transparent rounded-xl p-4 flex flex-col items-center text-center relative hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="w-full flex justify-between items-start text-xs text-white/50 mb-4 px-2">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${i < product?.strengthDots! ? "bg-white" : "bg-white/20"}`}
                        />
                      ))}
                    </div>
                    <span>
                      {product.flavor} {product.strength}
                    </span>
                  </div>

                  <div className="relative w-48 h-48 mb-6 transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
                      alt={product.nameAr}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{product.nameAr}</h3>
                  <p className="text-white/60 text-xs leading-relaxed mb-6 h-10 overflow-hidden">
                    {product.descriptionAr}
                  </p>

                  <div className="w-full flex items-center justify-between px-2 mt-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full border-0 h-10 w-10 transition-all duration-300 ${
                        addedProducts.has(product.id)
                          ? "bg-primary text-white"
                          : "bg-white text-black hover:bg-white/90"
                      }`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedProducts.has(product.id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>
                    <span className="font-bold text-lg">{Number.parseFloat(product!.price! as any).toFixed(2)} ر.س</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-white/50 text-lg">لا توجد منتجات تطابق البحث</p>
              </div>
            )}
          </div>

          {/* Filters Sidebar */}
          <div className="w-full md:w-64 md:order-2 shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-white/50" />
                <Input
                  placeholder="بحث..."
                  className="bg-transparent border-white/20 pr-10 text-right h-10 rounded-lg focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="bg-transparent border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm">فرز حسب الفئات</h4>
                  <button className="text-xs text-white/50 hover:text-white" onClick={() => setSelectedCategories([])}>
                    مسح الكل
                  </button>
                </div>
                <div className="space-y-4">
                  {["الإصدارات المحدودة", "نكهة من أرضنا", "نكهات للنعناع", "نكهات الفواكه"].map((cat) => (
                    <div key={cat} className="flex items-center justify-end space-x-3 space-x-reverse">
                      <Label htmlFor={`cat-${cat}`} className="text-sm font-light cursor-pointer text-white/80">
                        {cat}
                      </Label>
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

              {/* Strength Filter */}
              <div className="bg-transparent border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm">قوة النيكوتين</h4>
                  <button className="text-xs text-white/50 hover:text-white" onClick={() => setSelectedStrengths([])}>
                    مسح الكل
                  </button>
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
                        <Label
                          htmlFor={`str-${item.label}`}
                          className="text-sm font-light cursor-pointer text-white/80"
                        >
                          {item.label}
                        </Label>
                        <div className="flex gap-0.5">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full ${i < item.dots ? "bg-white" : "bg-white/20"}`}
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
