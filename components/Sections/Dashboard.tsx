"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function DashboardShowcase() {
  const ref = useRef<HTMLDivElement>(null);

  // mouse movement values
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

    const rotateXVal = ((y - centerY) / centerY) * -6; // tilt up/down
    const rotateYVal = ((x - centerX) / centerX) * 8;  // tilt left/right

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
        <div className="w-[120vw] max-w-[1100px] h-[420px] bg-white/10 blur-[160px] rounded-full" />
      </div>

      {/* laptop container */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        style={{
          rotateX: springX,
          rotateY: springY,
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
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-3 shadow-2xl">

            {/* top bezel */}
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>

            {/* screen */}
            <div className="bg-[#0e0e0e] border border-white/10 rounded-xl overflow-hidden">
              <Image
                src='/real-analysis.png'
                alt="dashboard-screenshot"
                width={1200}
                height={675}
                priority={false}
                loading="eager"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* laptop base (this is what makes it feel REAL) */}
          <div className="relative mx-auto w-[85%] h-6 bg-[#0a0a0a] border-x border-b border-white/10 rounded-b-2xl shadow-xl" />

          {/* reflection glow */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-[80px] bg-white/10 blur-3xl rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}