"use client"

import { motion } from "framer-motion"

export function InfoSection() {
  return (
    <section className="bg-black text-white py-24 border-t border-white/10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at center, #fff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 border-b border-white/10 pb-12"
        >
          <div className="max-w-2xl text-right md:order-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 text-white leading-tight">
              إيضاح القوة والنكهات.
            </h2>
          </div>
          <div className="text-right md:text-left md:order-1 max-w-xl">
            <p className="text-white/60 leading-relaxed text-base md:text-lg">
              هناك ثلاثة جوانب مختلفة يجب وضعها في الاعتبار عند اختيار دزرت، مدى قوة تركيز النيكوتين والنكهة. تقدم دزرت
              مجموعة متنوعة من النكهات، من الخفيفة إلى القوية بنكهات متعددة.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Right Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-right space-y-10"
          >
            <div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 leading-tight">
                من المهم اختيار قوة تركيز{" "}
                <span className="bg-gradient-to-l from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  النيكوتين لديك.
                </span>
              </h3>
              <p className="text-white/80 leading-relaxed text-lg md:text-xl">
                ومن أجل فهم ذلك، لدينا نظام نقاط بسيط، من نقطة واحدة إلى ثلاث نقاط، حتى تعرف التركيز المناسب لك.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <p className="text-white/70 text-base leading-loose">
                دزرت ليس مجرد ظرف نيكوتين، بل نظام تدريجي مصمم ليساعدك على الإقلاع عن التدخين بشكل آمن وسلس من خلال ثلاث
                مستويات مدروسة من النيكوتين تتيح لك تقليل الاعتماد خطوة بخطوة حتى تصل إلى حياة خالية من النيكوتين، حيث
                إن "نقطة" تشير إلى المستوى الخفيف وهو الخيار المثالي لمن يرغبون في تقليل استهلاك النيكوتين أو في المراحل
                الأخيرة من الإقلاع، و"نقطتين" تشير إلى المستوى المتوسط المناسب لمن يحتاجون إلى دعم معتدل في رحلتهم نحو
                الإقلاع، أما "ثلاث نقاط" فهي تمثل المستوى القوي المخصص فقط لمن لديهم اعتماد عالٍ على النيكوتين ويحتاجون
                إلى بداية أقوى، مع دزرت الإقلاع لا يعني التوقف المفاجئ، بل خذ وقتك، خفف بالتدريج، وابدأ حياة أنقى.
              </p>
            </div>
          </motion.div>

          {/* Left Column - Visual Strength Indicator */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-full min-h-[500px] flex items-center justify-center bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl p-12 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex flex-col gap-12 items-center">
              {[
                { dots: 1, label: "خفيف", opacity: 40, size: "sm" },
                { dots: 2, label: "متوسط", opacity: 70, size: "md" },
                { dots: 3, label: "قوي", opacity: 100, size: "lg" },
              ].map((level, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-6"
                >
                  <div className="flex gap-3">
                    {[...Array(level.dots)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`rounded-full bg-primary shadow-lg shadow-primary/30`}
                        style={{
                          opacity: level.opacity / 100,
                          width: level.size === "lg" ? 24 : level.size === "md" ? 20 : 16,
                          height: level.size === "lg" ? 24 : level.size === "md" ? 20 : 16,
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-white font-bold text-xl min-w-[80px]" style={{ opacity: level.opacity / 100 }}>
                    {level.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-[200px] font-bold bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
                ١ ٢ ٣
              </span>
            </div>

            <div className="absolute top-6 right-6 w-20 h-20 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
            <div className="absolute bottom-6 left-6 w-20 h-20 border-b-2 border-l-2 border-primary/30 rounded-bl-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
