"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, Play, Square } from "lucide-react";

export default function DashboardShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 80, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 80, damping: 20 });

  const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXVal = ((y - centerY) / centerY) * -6;
    const rotateYVal = ((x - centerX) / centerX) * 8;

    rotateX.set(rotateXVal);
    rotateY.set(rotateYVal);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section className="relative py-20 md:py-32 px-4 flex justify-center overflow-hidden">

      {/* glow background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[120vw] max-w-[1100px] h-[420px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-[160px] rounded-full" />
      </div>

      {/* laptop container */}
      <motion.div
        ref={ref}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          resetTilt();
          setIsHovering(false);
        }}
        onMouseMove={handleMouseMove}
        style={{
          rotateX: springX,
          rotateY: springY,
          transition: isHovering ? 'none' : 'all 0.5s ease',
        }}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9 }}
        className="relative w-[75vw] perspective-[1200px]"
      >

        {/* L A P T O P   F R A M E */}
        <div className="relative">

          {/* screen outer shell */}
          <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-white/10 rounded-2xl p-3 shadow-2xl shadow-black/50">

            {/* top bezel with camera */}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10 border border-white/5" />
                <span className="text-[8px] tracking-[0.2em] uppercase text-white/20">GitInsight AI</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-3 h-3 text-white/20 hover:text-white/40 transition-colors cursor-pointer" />
              </div>
            </div>

            {/* screen */}
            <div className="bg-[#0e0e0e] border border-white/5 rounded-xl overflow-hidden relative">
              <Image
                src='/real-analysis.png'
                alt="dashboard-screenshot"
                width={1200}
                height={675}
                priority={false}
                loading="eager"
                className="w-full h-auto"
              />
              {/* Screen glare overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* laptop base - improved */}
          <div className="relative mx-auto w-[85%] h-6 bg-gradient-to-b from-[#0a0a0a] to-[#080808] border-x border-b border-white/10 rounded-b-2xl shadow-2xl shadow-black/80" />
          
          {/* Keyboard indicator */}
          <div className="relative mx-auto w-[65%] h-0.5 bg-white/5 rounded-full mt-0.5" />

          {/* reflection glow */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-[80px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}