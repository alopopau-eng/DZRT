import { motion } from "framer-motion";

export function InfoSection() {
  return (
    <section className="bg-black text-white py-20 border-t border-white/5 relative overflow-hidden">
      
      {/* Background Pattern - Subtle Diamonds/Triangles */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{
             backgroundImage: "radial-gradient(circle at center, #333 1px, transparent 1px)",
             backgroundSize: "20px 20px"
           }}
      />

      <div className="container px-4 mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-white/10 pb-8">
           <div className="max-w-xl text-right md:order-2">
             <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">إيضاح القوة والنكهات.</h2>
           </div>
           
           <div className="text-right md:text-left md:order-1 max-w-lg">
             <p className="text-white/60 leading-relaxed text-sm md:text-base">
               هناك ثلاثة جوانب مختلفة يجب وضعها في الاعتبار عند اختيار دزرت، مدى قوة تركيز النيكوتين والنكهة. تقدم دزرت مجموعة متنوعة من النكهات، من الخفيفة إلى القوية بنكهات متعددة.
             </p>
           </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Right Column (Text) */}
          <div className="text-right space-y-8">
             <div>
               <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4">
                 من المهم اختيار قوة تركيز <span className="text-primary">النيكوتين لديك.</span>
               </h3>
               <p className="text-white/70 leading-relaxed text-lg">
                 ومن أجل فهم ذلك، لدينا نظام نقاط بسيط، من نقطة واحدة إلى ثلاث نقاط، حتى تعرف التركيز المناسب لك.
               </p>
             </div>
             
             <div className="text-white/50 text-sm leading-loose">
               <p>
                 دزرت ليس مجرد ظرف نيكوتين، بل نظام تدريجي مصمم ليساعدك على الإقلاع عن التدخين بشكل آمن وسلس من خلال ثلاث مستويات مدروسة من النيكوتين تتيح لك تقليل الاعتماد خطوة بخطوة حتى تصل إلى حياة خالية من النيكوتين، حيث إن "نقطة" تشير إلى المستوى الخفيف وهو الخيار المثالي لمن يرغبون في تقليل استهلاك النيكوتين أو في المراحل الأخيرة من الإقلاع، و"نقطتين" تشير إلى المستوى المتوسط المناسب لمن يحتاجون إلى دعم معتدل في رحلتهم نحو الإقلاع، أما "ثلاث نقاط" فهي تمثل المستوى القوي المخصص فقط لمن لديهم اعتماد عالٍ على النيكوتين ويحتاجون إلى بداية أقوى، مع دزرت الإقلاع لا يعني التوقف المفاجئ، بل خذ وقتك، خفف بالتدريج، وابدأ حياة أنقى.
               </p>
             </div>
          </div>

           {/* Left Column (Visual - Illustration of Dots/Strength) */}
           <div className="relative h-full min-h-[300px] flex items-center justify-center bg-white/5 rounded-2xl p-8 border border-white/10">
              {/* Placeholder for strength visualization */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                   <div className="w-4 h-4 rounded-full bg-primary/40"></div>
                   <span className="text-xs text-white/40">خفيف</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-4 h-4 rounded-full bg-primary/70"></div>
                   <span className="text-xs text-white/40">متوسط</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-4 h-4 rounded-full bg-primary"></div>
                   <span className="text-xs text-white/40">قوي</span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span className="text-9xl font-bold text-white">١ ٢ ٣</span>
              </div>
           </div>

        </div>
      </div>
    </section>
  );
}
