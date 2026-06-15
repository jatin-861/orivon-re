import { motion, Variants } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  tint = "bg-[var(--secondary)]/[0.04]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  tint?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            tint,
            "border-2 border-foreground/[0.06]",
            "shadow-[0_8px_32px_0_rgba(199,91,58,0.03)]",
          )}
        />
      </motion.div>
    </motion.div>
  );
}

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
}

export function HeroGeometric({
  badge = "Case Studies",
  title1 = "Things we've",
  title2 = "crafted & built.",
  description = "A handful of recent projects across brand, web and product. Each design is custom-built with pure CSS, code-split WebGL, and typographic grids.",
}: HeroGeometricProps) {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <div className="relative min-h-[75vh] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Floating interactive geometries (flat terracotta tints, no gradients) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          tint="bg-[var(--secondary)]/[0.06]"
          className="left-[-10%] md:left-[-5%] top-[12%] md:top-[16%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          tint="bg-[var(--secondary)]/[0.05]"
          className="right-[-5%] md:right-[0%] top-[60%] md:top-[65%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          tint="bg-[var(--secondary)]/[0.04]"
          className="left-[5%] md:left-[10%] bottom-[8%] md:bottom-[12%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          tint="bg-[var(--secondary)]/[0.04]"
          className="right-[15%] md:right-[20%] top-[8%] md:top-[12%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          tint="bg-[var(--secondary)]/[0.05]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[8%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/[0.02] border border-foreground/[0.06] mb-6 md:mb-8"
          >
            <Circle className="h-2 w-2 fill-[var(--secondary)] animate-pulse" />
            <span className="text-xs text-muted-foreground tracking-wider font-mono uppercase">
              {badge}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal mb-6 md:mb-8 tracking-tight leading-[0.95]">
              <span className="text-foreground">{title1}</span>
              <br />
              <span className="text-[var(--secondary)]">{title2}</span>
            </h1>
          </motion.div>

          {/* Subtitle / Description */}
          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed font-sans max-w-xl mx-auto px-4">
              {description}
            </p>
          </motion.div>
        </div>
      </div>

    </div>
  );
}

export default HeroGeometric;
