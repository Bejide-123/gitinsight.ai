"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";

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
    <section id="product-preview" className="relative flex flex-col items-center overflow-hidden border-b border-white/[0.08] bg-[#07090c] px-4 py-16 sm:px-6 md:py-20">
      <div className="mb-8 max-w-2xl text-center">
        <p className="mb-2 text-xs text-cyan-200">Product preview</p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">One report. A clearer engineering picture.</h2>
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
        className="relative w-full max-w-[1100px] perspective-[1200px]"
      >

        {/* L A P T O P   F R A M E */}
        <div className="relative">

          {/* screen outer shell */}
          <div className="rounded-lg border border-white/10 bg-[#0d1115] p-2 shadow-2xl shadow-black/30 sm:p-3">

            {/* top bezel with camera */}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10 border border-white/5" />
                <span className="text-[10px] text-zinc-500">GitInsight report</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-3 h-3 text-white/20 hover:text-white/40 transition-colors cursor-pointer" />
              </div>
            </div>

            {/* screen */}
            <div className="relative overflow-hidden rounded-md border border-white/[0.08] bg-[#07090c]">
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
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.04]" />
            </div>
          </div>

          {/* laptop base - improved */}
          <div className="relative mx-auto h-4 w-[85%] rounded-b-lg border-x border-b border-white/10 bg-[#101418]" />
          
          {/* Keyboard indicator */}
          <div className="relative mx-auto mt-1 h-0.5 w-[65%] rounded-full bg-white/[0.06]" />
        </div>
      </motion.div>
    </section>
  );
}