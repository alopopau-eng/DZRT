"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Percent, Sparkles, Shield, Truck } from "lucide-react"
import React from "react"
import { Button } from "../ui/button"

export function Hero() {
  return (
    <section className="relative w-full bg-black pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary),0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--primary),0.1),transparent_60%)]" />

      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container relative z-10 px-4 sm:px-6 md:px-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-heading text-white mb-4 sm:mb-5 md:mb-6 leading-tight px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            اكتشف تجربة{" "}
            <span className="bg-gradient-to-l from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              DZRT
            </span>
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            أكياس نيكوتين فاخرة بنكهات سعودية أصيلة
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-full max-w-5xl mx-auto mb-10 sm:mb-12 md:mb-16"
        >
          <div className="relative bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 border border-primary/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-10 lg:p-12 backdrop-blur-xl shadow-2xl shadow-primary/20">
            <motion.div
              className="absolute -top-3 sm:-top-4 right-4 sm:right-6 md:right-8 bg-gradient-to-l from-primary to-primary/80 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full shadow-lg"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              عرض خاص
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-7 md:gap-8">
              <a href="/products" className="order-2 md:order-1 w-full md:w-auto">
                <Button
                  size="lg"
                  className="w-full md:w-auto font-bold gap-2 sm:gap-3 text-base sm:text-lg md:text-xl px-8 sm:px-9 md:px-10 py-5 sm:py-6 md:py-7 rounded-xl shadow-lg hover:shadow-primary/50 transition-all hover:scale-105"
                >
                  تسوق الآن
                  <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </a>

              <div className="flex items-center gap-4 sm:gap-5 md:gap-6 text-right order-1 md:order-2">
                <div>
                  <p className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 bg-gradient-to-l from-white to-white/80 bg-clip-text text-transparent">
                    خصم حصري
                  </p>
                  <p className="text-white/70 text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                    على جميع المنتجات
                  </p>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl shadow-primary/40 shrink-0">
                  <Percent className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative w-full max-w-7xl mx-auto mb-10 sm:mb-12 md:mb-16"
        >
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent z-10 rounded-3xl" />

          <motion.img
            src="/hero-banner.webp"
            alt="DZRT Collection"
            className="w-full h-auto object-contain rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/60 border border-white/5"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />

          <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-primary/50 rounded-tr-2xl sm:rounded-tr-3xl" />
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-primary/50 rounded-bl-2xl sm:rounded-bl-3xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-5xl"
        >
          {[
            { icon: Sparkles, text: "نكهات سعودية أصيلة", delay: 0 },
            { icon: Truck, text: "توصيل سريع", delay: 0.1 },
            { icon: Shield, text: "جودة مضمونة", delay: 0.2 },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + feature.delay, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group flex items-center justify-center gap-3 sm:gap-4 text-white/90 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 sm:px-5 md:px-6 py-4 sm:py-5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all cursor-pointer"
            >
              <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-sm sm:text-base font-semibold">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
