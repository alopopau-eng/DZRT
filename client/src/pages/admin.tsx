"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  MapPin,
  Phone,
  Calendar,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react"
import { getOrders } from "@/lib/firebase"

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const loadData = async () => {
    setIsLoading(true)
    try {
      const fetchedOrders = await getOrders()
      setOrders(fetchedOrders)
      const calculatedAnalytics = calculateAnalytics(fetchedOrders)
      setAnalytics(calculatedAnalytics)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const recentOrders = getRecentOrders(orders, 5)

  if (isLoading && !analytics) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-white/60">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">لوحة التحكم</h1>
            <p className="text-white/60">نظرة شاملة على أداء متجرك</p>
          </div>

          <div className="flex items-center gap-3">
            <a href="/dashboard/users">
              <Button variant="outline" size="sm" className="bg-transparent border-white/20 hover:bg-white/5">
                <Users className="h-4 w-4 ml-2" />
                تتبع المستخدمين
              </Button>
            </a>
            <div className="text-xs text-white/50 flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              آخر تحديث: {lastRefresh.toLocaleTimeString("ar-SA")}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="bg-transparent border-white/20 hover:bg-white/5"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <RefreshCw className="h-4 w-4 ml-2" />}
              تحديث
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">إجمالي الطلبات</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analytics?.totalOrders || 0}</div>
              <p className="text-xs text-white/50 mt-1">طلب نشط</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">إجمالي الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analytics?.totalRevenue.toFixed(2) || 0} ر.س</div>
              <p className="text-xs text-white/50 mt-1">الإيرادات الإجمالية</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">متوسط قيمة الطلب</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analytics?.averageOrderValue.toFixed(2) || 0} ر.س</div>
              <p className="text-xs text-white/50 mt-1">لكل طلب</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">الخصومات المقدمة</CardTitle>
              <ShoppingCart className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analytics?.discountsGiven.toFixed(2) || 0} ر.س</div>
              <p className="text-xs text-white/50 mt-1">إجمالي الخصومات</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">أفضل المنتجات مبيعاً</CardTitle>
              <CardDescription className="text-white/50">حسب الإيرادات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-white/50">{product.quantity} وحدة</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">{product.revenue.toFixed(2)} ر.س</p>
                    </div>
                  </div>
                ))}
                {(!analytics?.topProducts || analytics.topProducts.length === 0) && (
                  <p className="text-center text-white/50 py-8">لا توجد بيانات</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">الطلبات حسب المدينة</CardTitle>
              <CardDescription className="text-white/50">التوزيع الجغرافي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics?.ordersByCity || {})
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([city, count], index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        <p className="font-medium text-white">{city}</p>
                      </div>
                      <Badge variant="secondary" className="bg-white/10">
                        {count} طلب
                      </Badge>
                    </div>
                  ))}
                {Object.keys(analytics?.ordersByCity || {}).length === 0 && (
                  <p className="text-center text-white/50 py-8">لا توجد بيانات</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">حسب مزود الخدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics?.phoneProviders || {}).map(([provider, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-white/50" />
                      <span className="text-sm text-white/80">{provider}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">حالة الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics?.ordersByStatus || {}).map(([status, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Badge
                      variant={status === "pending" ? "secondary" : "default"}
                      className={status === "pending" ? "bg-yellow-500/20 text-yellow-500" : ""}
                    >
                      {status === "pending" ? "قيد الانتظار" : status}
                    </Badge>
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">تفاصيل مالية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">الضرائب المحصلة</span>
                <span className="font-bold text-white">{analytics?.totalTax.toFixed(2)} ر.س</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex justify-between text-sm">
                <span className="text-white/60">رسوم الشحن</span>
                <span className="font-bold text-white">{analytics?.totalShipping.toFixed(2)} ر.س</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl">أحدث الطلبات</CardTitle>
            <CardDescription className="text-white/50">آخر 5 طلبات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs">
                          {order.id?.slice(-8)}
                        </Badge>
                        <Badge
                          variant={order.status === "pending" ? "secondary" : "default"}
                          className={order.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : ""}
                        >
                          {order.status === "pending" ? "قيد الانتظار" : order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>{order.shipping?.fullName}</span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.shipping?.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.shipping?.city}
                        </span>
                      </div>
                      <div className="text-xs text-white/40">{new Date(order.timestamp).toLocaleString("ar-SA")}</div>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-white">{order.pricing?.total.toFixed(2)} ر.س</p>
                      <p className="text-xs text-white/50">{order.items?.length} منتج</p>
                    </div>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && <p className="text-center text-white/50 py-8">لا توجد طلبات بعد</p>}
            </div>
          </CardContent>
        </Card>

        {analytics && analytics.revenueByDate.length > 0 && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">الإيرادات حسب التاريخ</CardTitle>
              <CardDescription className="text-white/50">آخر 7 أيام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.revenueByDate.slice(-7).map((day, index) => {
                  const maxRevenue = Math.max(...analytics.revenueByDate.map((d) => d.revenue))
                  const barWidth = (day.revenue / maxRevenue) * 100

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{new Date(day.date).toLocaleDateString("ar-SA")}</span>
                        <span className="font-bold text-white">{day.revenue.toFixed(2)} ر.س</span>
                      </div>
                      <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 right-0 bg-gradient-to-l from-primary to-primary/70 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-white/80 font-medium">{day.orders} طلب</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
