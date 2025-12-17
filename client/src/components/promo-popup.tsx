
import React,{ useState, useEffect } from "react"
import { Dialog, DialogContent } from "../components/ui/dialog"
import { Button } from "../components/ui/button"

interface PromoPopupProps {
  open: boolean
  onClose: () => void
}

export function PromoPopup({ open, onClose }: PromoPopupProps) {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 4,
    seconds: 23,
  })

  useEffect(() => {
    if (!open) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        } else {
          clearInterval(timer)
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden" showCloseButton={false}>
        {/* Banner Section with Credit Cards */}
        <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 p-8 text-center overflow-hidden">
          {/* Credit Card Images Background */}
          <div className="absolute inset-0 opacity-30">
            <img src="./aac.jpg" alt="Credit Cards" className="w-full h-full object-cover" />
          </div>

          {/* Offer Text */}
          <div className="relative z-10">
            <div className="text-white text-xl mb-2" dir="rtl">
              إسترداد نقدي
            </div>
            <div className="text-orange-500 text-7xl font-black mb-2">30%</div>
            <div className="text-white text-sm" dir="rtl">
              عند استخدامك البطاقات الائتمانية التالية
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="bg-white p-6">
          <h3 className="text-center text-2xl font-bold text-gray-800 mb-6" dir="rtl">
            باقي للعرض
          </h3>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-3 mb-2" dir="ltr">
            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 shadow-lg transform rotate-3 w-20 h-24 flex items-center justify-center">
                  <span className="text-5xl font-black text-white drop-shadow-lg">
                    {timeLeft.seconds.toString().padStart(2, "0")[1]}
                  </span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-600 mt-2" dir="rtl">
                ثواني
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 shadow-lg w-20 h-24 flex items-center justify-center">
                  <span className="text-5xl font-black text-white drop-shadow-lg">
                    {timeLeft.seconds.toString().padStart(2, "0")[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Colon Separator */}
            <div className="text-4xl font-black text-orange-500 pb-6">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 shadow-lg w-20 h-24 flex items-center justify-center">
                  <span className="text-5xl font-black text-white drop-shadow-lg">
                    {timeLeft.minutes.toString().padStart(2, "0")[1]}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 shadow-lg transform -rotate-3 w-20 h-24 flex items-center justify-center">
                  <span className="text-5xl font-black text-white drop-shadow-lg">
                    {timeLeft.minutes.toString().padStart(2, "0")[0]}
                  </span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-600 mt-2" dir="rtl">
                دقائق
              </span>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-8">
            <Button
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-lg h-12 rounded-xl"
              onClick={onClose}
            >
              متابعة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
