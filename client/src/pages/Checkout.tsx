import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  CreditCard,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Truck,
  Package,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Mail,
  Fingerprint,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from "@/lib/cartContext";
import { imageMap } from "./Products";

const SAUDI_CITIES = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الظهران",
  "الأحساء",
  "الطائف",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "حائل",
  "نجران",
  "جازان",
  "ينبع",
  "أبها",
  "الجبيل",
  "القطيف",
  "الخرج",
];

const shippingSchema = z.object({
  fullName: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().length(10, "رقم الجوال يجب أن يكون ١٠ أرقام").regex(/^05\d{8}$/, "رقم الجوال يجب أن يبدأ بـ 05"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  city: z.string().min(1, "المدينة مطلوبة"),
  district: z.string().min(2, "الحي مطلوب"),
  street: z.string().min(2, "الشارع مطلوب"),
  building: z.string().optional(),
});

const paymentSchema = z.object({
  cardName: z.string().min(2, "الاسم مطلوب"),
  cardNumber: z.string().min(16, "رقم البطاقة غير صحيح").max(19),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "التنسيق MM/YY"),
  cvc: z.string().min(3, "CVC مطلوب").max(4),
});

const SHIPPING_COST = 20.0;
const DISCOUNT_RATE = 0.2; // 20% discount

export default function Checkout() {
  const [step, setStep] = useState<"cart" | "shipping" | "payment">("cart");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<
    "card_otp" | "phone_input" | "phone_otp" | "nafath" | "success"
  >("card_otp");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [shippingData, setShippingData] = useState<z.infer<
    typeof shippingSchema
  > | null>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneProvider, setPhoneProvider] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [nafathId, setNafathId] = useState("");
  const [isNafathVerifying, setIsNafathVerifying] = useState(false);
  const [nafathAuthNumber, setNafathAuthNumber] = useState("");
  const [showNafathAuth, setShowNafathAuth] = useState(false);
  const [cardBankInfo, setCardBankInfo] = useState<{
    bankName?: string;
    cardType?: string;
    scheme?: string;
    bankLogo?: string;
  } | null>(null);

  const { items, updateQuantity, removeItem, clearCart, getSubtotal } =
    useCart();
  const subtotal = getSubtotal();
  const discount = subtotal * DISCOUNT_RATE;
  const total = subtotal - discount + SHIPPING_COST;

  const shippingForm = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      district: "",
      street: "",
      building: "",
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const onShippingSubmit = (values: z.infer<typeof shippingSchema>) => {
    setShippingData(values);
    setStep("payment");
  };

  const resetVerificationState = () => {
    setVerificationStep("card_otp");
    setOtpValue("");
    setPhoneNumber("");
    setPhoneProvider("");
    setPhoneOtp("");
    setNafathId("");
    setIsVerifying(false);
    setIsNafathVerifying(false);
    setNafathAuthNumber("");
    setShowNafathAuth(false);
    setCardBankInfo(null);
  };

  const onPaymentSubmit = async (values: z.infer<typeof paymentSchema>) => {
    resetVerificationState();
    setTimeout(() => {
      setIsOtpOpen(true);
    }, 500);
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep("phone_input");
    }, 1500);
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber && phoneProvider) {
      setVerificationStep("phone_otp");
    }
  };

  const handleVerifyPhoneOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep("nafath");
    }, 1500);
  };

  const handleNafathRequest = () => {
    const authNum = Math.floor(10 + Math.random() * 90).toString();
    setNafathAuthNumber(authNum);
    setShowNafathAuth(true);
  };

  const handleNafathConfirm = async () => {
    setIsNafathVerifying(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: {
            customerName: shippingData?.fullName,
            customerPhone: shippingData?.phone,
            customerEmail: shippingData?.email || null,
            shippingAddress: {
              city: shippingData?.city,
              district: shippingData?.district,
              street: shippingData?.street,
              building: shippingData?.building,
            },
            subtotal: subtotal.toFixed(2),
            shippingCost: SHIPPING_COST.toFixed(2),
            total: total.toFixed(2),
            paymentMethod: "card",
          },
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.nameAr,
            productStrength: item.strength,
            quantity: item.quantity,
            pricePerUnit: item.price.toFixed(2),
            totalPrice: (item.price * item.quantity).toFixed(2),
          })),
        }),
      });

      if (response.ok) {
        const order = await response.json();
        setOrderId(order.id);
        clearCart();
        setIsNafathVerifying(false);
        setVerificationStep("success");
      } else {
        setIsNafathVerifying(false);
        console.error("Failed to create order");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      setIsNafathVerifying(false);
    }
  };

  const getImage = (imageUrl: string) => {
    return imageMap[imageUrl];
  };

  if (items.length === 0 && verificationStep !== "success") {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-24 h-24 mx-auto mb-8 bg-white/5 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-white/30" />
            </div>
            <h1 className="text-3xl font-bold font-heading mb-4">
              سلة التسوق فارغة
            </h1>
            <p className="text-white/60 mb-8">
              لم تقم بإضافة أي منتجات إلى السلة بعد
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="font-bold"
                data-testid="button-browse-products"
              >
                تصفح المنتجات
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[
              { key: "cart", label: "السلة", icon: ShoppingBag },
              { key: "shipping", label: "الشحن", icon: Truck },
              { key: "payment", label: "الدفع", icon: CreditCard },
            ].map((s, index) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    step === s.key
                      ? "bg-primary text-white"
                      : index < ["cart", "shipping", "payment"].indexOf(step)
                        ? "bg-primary/20 text-primary"
                        : "bg-white/5 text-white/40"
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {s.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < ["cart", "shipping", "payment"].indexOf(step)
                        ? "bg-primary"
                        : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Order Summary - Always Visible */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-6 sticky top-24">
                <h2 className="text-xl font-bold font-heading mb-6 text-right flex items-center justify-end gap-2">
                  <span>ملخص الطلب</span>
                  <Package className="h-5 w-5 text-primary" />
                </h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 items-center bg-white/5 rounded-xl p-3"
                      data-testid={`cart-item-${item.productId}`}
                    >
                      <div className="w-14 h-14 bg-white/5 rounded-lg p-1.5 shrink-0">
                        <img
                          src={getImage(item.imageUrl)}
                          alt={item.nameAr}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 text-right min-w-0">
                        <h3 className="font-bold text-sm truncate">
                          {item.nameAr}
                        </h3>
                        <p className="text-xs text-white/50">{item.strength}</p>
                      </div>
                      <div className="text-left shrink-0">
                        <div className="font-bold text-sm text-primary">
                          {(item.price * item.quantity).toFixed(2)} ر.س
                        </div>
                        <div className="text-xs text-white/50">
                          x{item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/10 mb-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span data-testid="text-subtotal">
                      {subtotal.toFixed(2)} ر.س
                    </span>
                    <span className="text-white/60">المجموع الفرعي</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span data-testid="text-discount">
                      - {discount.toFixed(2)} ر.س
                    </span>
                    <span>خصم ٢٠٪</span>
                  </div>
                  <div className="flex justify-between">
                    <span data-testid="text-shipping">
                      {SHIPPING_COST.toFixed(2)} ر.س
                    </span>
                    <span className="text-white/60">الشحن</span>
                  </div>
                </div>

                <Separator className="bg-white/10 my-4" />

                <div className="flex justify-between text-xl font-bold">
                  <span className="text-primary" data-testid="text-total">
                    {total.toFixed(2)} ر.س
                  </span>
                  <span>الإجمالي</span>
                </div>

                <div className="mt-6 bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3 text-sm text-primary/90 justify-end">
                  <span>شحن آمن وسريع لجميع مناطق المملكة</span>
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 order-2 lg:order-1">
              <AnimatePresence mode="wait">
                {/* Cart Step */}
                {step === "cart" && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-6 sm:p-8"
                  >
                    <h2 className="text-xl font-bold font-heading mb-6 text-right flex items-center justify-end gap-2">
                      <span>سلة التسوق</span>
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </h2>

                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row gap-4 items-center bg-white/5 rounded-xl p-4"
                          data-testid={`cart-editable-item-${item.productId}`}
                        >
                          <div className="w-20 h-20 bg-white/5 rounded-xl p-2 shrink-0">
                            <img
                              src={getImage(item.imageUrl)}
                              alt={item.nameAr}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 text-center sm:text-right">
                            <h3 className="font-bold text-lg">{item.nameAr}</h3>
                            <p className="text-sm text-white/50">
                              {item.strength}
                            </p>
                            <p className="text-primary font-bold mt-1">
                              {item.price.toFixed(2)} ر.س
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              data-testid={`button-decrease-${item.productId}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span
                              className="w-8 text-center font-bold"
                              data-testid={`text-quantity-${item.productId}`}
                            >
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              data-testid={`button-increase-${item.productId}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-bold text-lg min-w-[80px] text-left">
                              {(item.price * item.quantity).toFixed(2)} ر.س
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              onClick={() => removeItem(item.productId)}
                              data-testid={`button-remove-${item.productId}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Link href="/products" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-white/20 hover:bg-white/5"
                          data-testid="button-continue-shopping"
                        >
                          <ArrowLeft className="h-4 w-4 ml-2" />
                          متابعة التسوق
                        </Button>
                      </Link>
                      <Button
                        size="lg"
                        className="flex-1 font-bold"
                        onClick={() => setStep("shipping")}
                        data-testid="button-proceed-shipping"
                      >
                        متابعة للشحن
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Shipping Step */}
                {step === "shipping" && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-6 sm:p-8"
                  >
                    <h2 className="text-xl font-bold font-heading mb-6 text-right flex items-center justify-end gap-2">
                      <span>عنوان الشحن</span>
                      <MapPin className="h-5 w-5 text-primary" />
                    </h2>

                    <Form {...shippingForm}>
                      <form
                        onSubmit={shippingForm.handleSubmit(onShippingSubmit)}
                        className="space-y-6 text-right"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField
                            control={shippingForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center justify-end gap-2">
                                  الاسم الكامل
                                  <User className="h-4 w-4 text-white/40" />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="الاسم الكامل"
                                    {...field}
                                    className="text-right bg-black/40 border-white/10 focus-visible:ring-primary h-12"
                                    data-testid="input-fullname"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={shippingForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center justify-end gap-2">
                                  رقم الجوال
                                  <Phone className="h-4 w-4 text-white/40" />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="05XXXXXXXX"
                                    {...field}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                      field.onChange(val);
                                    }}
                                    className="text-left bg-black/40 border-white/10 focus-visible:ring-primary h-12 ltr"
                                    maxLength={10}
                                    data-testid="input-phone"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={shippingForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center justify-end gap-2">
                                البريد الإلكتروني (اختياري)
                                <Mail className="h-4 w-4 text-white/40" />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="example@email.com"
                                  {...field}
                                  className="text-left bg-black/40 border-white/10 focus-visible:ring-primary h-12 ltr"
                                  data-testid="input-email"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <Separator className="bg-white/10" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField
                            control={shippingForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>المدينة</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="text-right bg-black/40 border-white/10 focus-visible:ring-primary h-12" data-testid="select-city">
                                      <SelectValue placeholder="اختر المدينة" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {SAUDI_CITIES.map((city) => (
                                      <SelectItem key={city} value={city}>
                                        {city}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={shippingForm.control}
                            name="district"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الحي</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="اسم الحي"
                                    {...field}
                                    className="text-right bg-black/40 border-white/10 focus-visible:ring-primary h-12"
                                    data-testid="input-district"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField
                            control={shippingForm.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الشارع</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="اسم الشارع"
                                    {...field}
                                    className="text-right bg-black/40 border-white/10 focus-visible:ring-primary h-12"
                                    data-testid="input-street"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={shippingForm.control}
                            name="building"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  رقم المبنى / الشقة (اختياري)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="مثال: مبنى 5، شقة 12"
                                    {...field}
                                    className="text-right bg-black/40 border-white/10 focus-visible:ring-primary h-12"
                                    data-testid="input-building"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex gap-4 mt-8">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-white/20 hover:bg-white/5"
                            onClick={() => setStep("cart")}
                            data-testid="button-back-cart"
                          >
                            العودة للسلة
                          </Button>
                          <Button
                            type="submit"
                            size="lg"
                            className="flex-1 font-bold"
                            data-testid="button-proceed-payment"
                          >
                            متابعة للدفع
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                )}

                {/* Payment Step */}
                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/10 p-6 sm:p-8"
                  >
                    <h2 className="text-xl font-bold font-heading mb-6 text-right flex items-center justify-end gap-2">
                      <span>معلومات الدفع</span>
                      <CreditCard className="h-5 w-5 text-primary" />
                    </h2>

                    {shippingData && (
                      <div className="bg-white/5 rounded-xl p-4 mb-6 text-right">
                        <div className="flex items-center justify-between mb-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80 h-auto p-0"
                            onClick={() => setStep("shipping")}
                          >
                            تعديل
                          </Button>
                          <span className="font-bold text-sm flex items-center gap-2">
                            عنوان الشحن
                            <MapPin className="h-4 w-4 text-primary" />
                          </span>
                        </div>
                        <p className="text-white/70 text-sm">
                          {shippingData.fullName} • {shippingData.phone}
                        </p>
                        <p className="text-white/50 text-sm">
                          {shippingData.street}، {shippingData.district}،{" "}
                          {shippingData.city}
                          {shippingData.building &&
                            ` - ${shippingData.building}`}
                        </p>
                      </div>
                    )}

                    <Form {...paymentForm}>
                      <form
                        onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
                        className="space-y-6 text-right"
                      >
                        <FormField
                          control={paymentForm.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الاسم على البطاقة</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="الاسم كما يظهر على البطاقة"
                                  {...field}
                                  className="text-right bg-black/40 border-white/10 focus-visible:ring-primary h-12"
                                  data-testid="input-card-name"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={paymentForm.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>رقم البطاقة</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="0000 0000 0000 0000"
                                    {...field}
                                    className="text-left bg-black/40 border-white/10 focus-visible:ring-primary ltr pl-14 h-12"
                                    onChange={async (e) => {
                                      const val = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 16);
                                      field.onChange(val);
                                      
                                      if (val.length >= 6 && val.slice(0, 6) !== cardBankInfo?.bankName?.slice(0, 6)) {
                                        try {
                                          const response = await fetch("/api/bin-lookup", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ bin: val.slice(0, 6) }),
                                          });
                                          if (response.ok) {
                                            const data = await response.json();
                                            setCardBankInfo({
                                              bankName: data.BIN?.issuer?.name || "",
                                              cardType: data.BIN?.type || "",
                                              scheme: data.BIN?.brand || "",
                                              bankLogo: data.BIN?.issuer?.logo || "",
                                            });
                                          }
                                        } catch (error) {
                                          console.error("BIN lookup failed:", error);
                                        }
                                      }
                                    }}
                                    data-testid="input-card-number"
                                  />
                                  <div className="absolute left-3 top-3.5 flex gap-1">
                                    {field.value?.startsWith("4") ? (
                                      <img
                                        src="/visa.svg"
                                        alt="Visa"
                                        className="h-6 w-6"
                                      />
                                    ) : (
                                      <img
                                        src="/mastercard.svg"
                                        alt="Mastercard"
                                        className="h-6 w-6"
                                      />
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-6">
                          <FormField
                            control={paymentForm.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تاريخ الانتهاء</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="MM/YY"
                                    {...field}
                                    className="text-center bg-black/40 border-white/10 focus-visible:ring-primary h-12"
                                    maxLength={5}
                                    data-testid="input-expiry"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={paymentForm.control}
                            name="cvc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>رمز الأمان (CVC)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123"
                                    {...field}
                                    type="password"
                                    maxLength={4}
                                    data-testid="input-cvc"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex gap-4 mt-8">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-white/20 hover:bg-white/5"
                            onClick={() => setStep("shipping")}
                            data-testid="button-back-shipping"
                          >
                            العودة
                          </Button>
                          <Button
                            type="submit"
                            size="lg"
                            className="flex-1 text-lg font-bold h-14"
                            data-testid="button-pay"
                          >
                            إتمام الدفع ({total.toFixed(2)} ر.س)
                          </Button>
                        </div>

                        <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          جميع المعاملات مشفرة وآمنة ١٠٠٪
                        </p>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* OTP Dialog */}
      <Dialog
        open={isOtpOpen}
        onOpenChange={(open) => {
          setIsOtpOpen(open);
          if (!open) resetVerificationState();
        }}
      >
        <DialogContent className="p-0 overflow-hidden bg-white border-0 text-black sm:max-w-md">
          {/* Step 1: Card OTP */}
          {verificationStep === "card_otp" && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {cardBankInfo?.scheme?.toUpperCase() === "VISA" || paymentForm.getValues("cardNumber")?.startsWith("4") ? (
                    <div className="bg-white rounded-md p-1.5">
                      <img src="/visa.svg" alt="VISA" className="h-6 w-auto" />
                    </div>
                  ) : (
                    <div className="bg-white rounded-md p-1.5">
                      <img src="/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
                    </div>
                  )}
                  {cardBankInfo?.cardType && (
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded">{cardBankInfo.cardType}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {cardBankInfo?.bankLogo && (
                    <img src={cardBankInfo.bankLogo} alt="Bank" className="h-8 w-8 rounded bg-white p-0.5" />
                  )}
                  <span className="text-white font-semibold" data-testid="text-bank-name">
                    {cardBankInfo?.bankName || "البنك الرقمي"}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <DialogHeader className="text-center space-y-2">
                  <DialogTitle className="text-xl font-bold text-center text-gray-800">
                    أدخل رمز التحقق
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-600 text-sm">
                    تم إرسال رمز التحقق إلى جوالك المنتهي بـ{" "}
                    {shippingData?.phone?.slice(-2) || "XX"}
                    <br />
                    <span className="text-gray-500">لديك ٦ محاولات</span>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                  <label className="text-sm text-blue-600 font-medium block text-center">
                    رمز التحقق
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={4}
                      value={otpValue}
                      onChange={(value) => setOtpValue(value)}
                      data-testid="input-otp"
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="border-gray-300 bg-white h-14 w-12 text-xl text-black"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                    onClick={handleVerifyOtp}
                    disabled={otpValue.length < 4 || isVerifying}
                    data-testid="button-verify-otp"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        جاري التحقق...
                      </>
                    ) : (
                      "متابعة"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => setIsOtpOpen(false)}
                    data-testid="button-cancel-otp"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Phone Input */}
          {verificationStep === "phone_input" && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
                <Smartphone className="h-6 w-6 text-white" />
                <span className="text-white font-semibold">
                  التحقق من رقم الجوال
                </span>
              </div>

              <div className="p-6 space-y-6">
                <DialogHeader className="text-center space-y-2">
                  <DialogTitle className="text-xl font-bold text-center text-gray-800">
                    أدخل رقم الجوال
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-600 text-sm">
                    يرجى إدخال رقم جوالك لإرسال رمز التحقق
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium block text-right">
                      مزود الخدمة
                    </label>
                    <Select
                      value={phoneProvider}
                      onValueChange={setPhoneProvider}
                    >
                      <SelectTrigger
                        className="w-full h-12 text-right bg-gray-50 border-gray-200"
                        data-testid="select-provider"
                      >
                        <SelectValue placeholder="اختر مزود الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stc">STC</SelectItem>
                        <SelectItem value="mobily">موبايلي</SelectItem>
                        <SelectItem value="zain">زين</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium block text-right">
                      رقم الجوال
                    </label>
                    <Input
                      placeholder="05XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 text-left ltr bg-gray-50 border-gray-200"
                      data-testid="input-phone-verify"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                    onClick={handlePhoneSubmit}
                    disabled={!phoneNumber || !phoneProvider}
                    data-testid="button-submit-phone"
                  >
                    إرسال رمز التحقق
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    onClick={() => setVerificationStep("card_otp")}
                    data-testid="button-back-card-otp"
                  >
                    العودة
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Phone OTP */}
          {verificationStep === "phone_otp" && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
                <Smartphone className="h-6 w-6 text-white" />
                <span className="text-white font-semibold">
                  التحقق من رقم الجوال
                </span>
              </div>

              <div className="p-6 space-y-6">
                <DialogHeader className="text-center space-y-2">
                  <DialogTitle className="text-xl font-bold text-center text-gray-800">
                    رمز التحقق
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-600 text-sm">
                    تم إرسال رمز التحقق إلى {phoneNumber}
                    <br />
                    <span className="text-gray-500">
                      يرجى إدخال الرمز المكون من ٤ أرقام
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                  <label className="text-sm text-blue-600 font-medium block text-center">
                    رمز التحقق
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={4}
                      value={phoneOtp}
                      onChange={(value) => setPhoneOtp(value)}
                      data-testid="input-phone-otp"
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="border-gray-300 bg-white h-14 w-12 text-xl text-black"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                    onClick={handleVerifyPhoneOtp}
                    disabled={phoneOtp.length < 4 || isVerifying}
                    data-testid="button-verify-phone-otp"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        جاري التحقق...
                      </>
                    ) : (
                      "متابعة"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => setVerificationStep("phone_input")}
                    data-testid="button-back-phone-input"
                  >
                    العودة
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Nafath */}
          {verificationStep === "nafath" && !showNafathAuth && (
            <>
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 flex items-center justify-between">
                <Fingerprint className="h-6 w-6 text-white" />
                <span className="text-white font-semibold">نفاذ</span>
              </div>

              <div className="p-6 space-y-6">
                <DialogHeader className="text-center space-y-2">
                  <DialogTitle className="text-xl font-bold text-center text-gray-800">
                    التحقق عبر نفاذ
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-600 text-sm">
                    يرجى إدخال رقم الهوية الوطنية للتحقق
                  </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <Fingerprint className="w-10 h-10 text-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium block text-right">
                    رقم الهوية الوطنية
                  </label>
                  <Input
                    placeholder="10XXXXXXXX"
                    value={nafathId}
                    onChange={(e) =>
                      setNafathId(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    className="h-12 text-center bg-gray-50 border-gray-200"
                    maxLength={10}
                    data-testid="input-nafath-id"
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                    onClick={handleNafathRequest}
                    disabled={nafathId.length < 10}
                    data-testid="button-nafath-request"
                  >
                    إرسال طلب نفاذ
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    onClick={() => setVerificationStep("phone_otp")}
                    data-testid="button-back-phone-otp"
                  >
                    العودة
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 4b: Nafath Auth Confirmation */}
          {verificationStep === "nafath" && showNafathAuth && (
            <>
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 flex items-center justify-between">
                <Fingerprint className="h-6 w-6 text-white" />
                <span className="text-white font-semibold">نفاذ</span>
              </div>

              <div className="p-6 space-y-6">
                <DialogHeader className="text-center space-y-2">
                  <DialogTitle className="text-xl font-bold text-center text-gray-800">
                    رقم التحقق
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-600 text-sm">
                    افتح تطبيق نفاذ واضغط على الرقم التالي
                  </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-green-100 rounded-2xl flex items-center justify-center">
                    <span
                      className="text-5xl font-bold text-green-600"
                      data-testid="text-nafath-auth-number"
                    >
                      {nafathAuthNumber}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <span className="font-medium">الخطوات:</span>
                  </div>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside mr-6">
                    <li>افتح تطبيق نفاذ على جوالك</li>
                    <li>اختر الرقم {nafathAuthNumber} من القائمة</li>
                    <li>اضغط على تأكيد</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                    onClick={handleNafathConfirm}
                    disabled={isNafathVerifying}
                    data-testid="button-nafath-confirm"
                  >
                    {isNafathVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        جاري التحقق...
                      </>
                    ) : (
                      "تم التأكيد في التطبيق"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowNafathAuth(false)}
                    disabled={isNafathVerifying}
                    data-testid="button-back-nafath-id"
                  >
                    العودة
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 5: Success */}
          {verificationStep === "success" && (
            <div className="py-10 px-6 flex flex-col items-center text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800">
                تم الدفع بنجاح!
              </h2>
              {orderId && (
                <p
                  className="text-blue-600 font-mono text-lg"
                  data-testid="text-order-id"
                >
                  رقم الطلب: #{orderId}
                </p>
              )}
              <p className="text-gray-600">
                شكراً لطلبك. ستتلقى رسالة تأكيد قريباً.
              </p>
              <Link href="/">
                <Button
                  className="mt-8 min-w-[200px] bg-blue-600 hover:bg-blue-700"
                  data-testid="button-return-home"
                >
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
