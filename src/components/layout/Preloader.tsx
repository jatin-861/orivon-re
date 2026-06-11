import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("orivon-preloader-seen");
    }
    return true;
  });
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!shouldRender) return;

    // Lock body scroll during load
    document.body.style.overflow = "hidden";

    // Progress counter simulation
    const duration = 2000; // 2 seconds total loading
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsComplete(true);
          sessionStorage.setItem("orivon-preloader-seen", "true");
          // Unlock body scroll
          document.body.style.overflow = "";
        }, 600); // Hold at 100% for a brief moment
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const brandWords = "ORIVON".split("");

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#0c0d10] p-8 md:p-16 text-white"
        >
          {/* Top text */}
          <div className="flex justify-between items-center text-xs font-mono tracking-widest text-muted-foreground uppercase opacity-60">
            <span>ORIVON CREATIVE STUDIO</span>
            <span>STG // 2026</span>
          </div>

          {/* Centered Orivon Logo Lettering */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="overflow-hidden flex gap-[0.1em] text-[clamp(2.5rem,10vw,8rem)] font-display font-bold leading-none tracking-tight">
              <span className="sr-only">ORIVON</span>
              <span aria-hidden="true" className="flex gap-[0.1em]">
                {brandWords.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-xs font-mono tracking-[0.4em] uppercase mt-4 text-[var(--brand-peach)] font-bold"
            >
              Independent Digital Craft
            </motion.p>
          </div>

          {/* Bottom loading bar & progress */}
          <div
            className="space-y-4"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading progress"
          >
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground opacity-50 uppercase">
                Initializing immersive engine
              </span>
              <span className="font-mono text-4xl md:text-6xl font-bold text-white/90">
                {progress.toString().padStart(3, "0")}
              </span>
            </div>

            {/* Premium, micro-thin loading bar */}
            <div className="h-[2px] w-full bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--brand-pink)] via-[var(--brand-peach)] to-[var(--brand-lavender)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
