import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  // useRef freezes this value at mount time — reading sessionStorage on every render
  // would flip alreadySeen from false→true the moment the effect sets the key,
  // which triggers effect cleanup (clearInterval) mid-animation and freezes the loader.
  const alreadySeenRef = useRef(
    typeof sessionStorage !== "undefined" && !!sessionStorage.getItem("preloaderSeen"),
  );
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(alreadySeenRef.current);

  useEffect(() => {
    if (alreadySeenRef.current) return;

    sessionStorage.setItem("preloaderSeen", "1");
    document.body.style.overflow = "hidden";

    const duration = 2000;
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
          document.body.style.overflow = "";
        }, 600);
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []); // Empty — runs once on mount; alreadySeenRef is stable and never changes

  const brandWords = "ORVION.CO".split("");

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[var(--background)] p-8 md:p-16 text-[var(--foreground)]"
        >
          {/* Top text */}
          <div className="flex justify-between items-center text-xs font-mono tracking-widest text-muted-foreground uppercase opacity-60">
            <span>Orvion.co</span>
            <span>Product Engineers</span>
          </div>

          {/* Centered Logo Lettering */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="overflow-hidden flex gap-[0.1em] text-[clamp(2.5rem,10vw,8rem)] font-serif font-normal leading-none tracking-tight">
              <span className="sr-only">Orvion.co</span>
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
              className="text-xs font-mono tracking-[0.4em] uppercase mt-4 text-[var(--secondary)] font-bold"
            >
              Built To Run In Production
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
                Loading
              </span>
              <span className="font-mono text-4xl md:text-6xl font-bold text-[var(--foreground)]/90">
                {progress.toString().padStart(3, "0")}
              </span>
            </div>

            {/* Premium, micro-thin loading bar */}
            <div className="h-[2px] w-full bg-[var(--border)] relative overflow-hidden rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[var(--secondary)]"
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
