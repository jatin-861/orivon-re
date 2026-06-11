import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((p) => (p + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(handleNext, 5000);
    return () => clearInterval(id);
  }, [autoplay, handleNext]);

  const isActive = (i: number) => i === active;
  const getStableRotate = (i: number) => {
    const rotations = [-6, 6, -3, 3, -4, 4];
    return `${rotations[i % rotations.length]}deg`;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 font-body">
      <div className="relative grid grid-cols-1 gap-16 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((t, index) => (
                <motion.div
                  key={t.src}
                  initial={{ opacity: 0, scale: 0.9, z: -100, rotate: getStableRotate(index) }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.6,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? "0deg" : getStableRotate(index),
                    zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -20, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9, z: 100, rotate: getStableRotate(index) }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={t.src}
                    alt={t.name}
                    draggable={false}
                    className="h-full w-full rounded-xl object-cover object-center border border-border/80 shadow-elegant grayscale saturate-50 hover:grayscale-0 hover:saturate-100 transition-all duration-500"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="font-display text-3xl font-bold text-foreground">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-primary mt-1">{testimonials[active].designation}</p>
            <motion.p className="mt-8 text-lg text-muted-foreground leading-relaxed">
              {testimonials[active].quote.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * i }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div className="flex gap-3 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/btn flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Previous"
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover/btn:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNext}
              className="group/btn flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Next"
            >
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
