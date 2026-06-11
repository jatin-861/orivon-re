"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedBadgeProps = {
  text?: string;
  color?: string;
  className?: string;
};

export const AnimatedBadge = ({
  text = "Available for new projects",
  color = "var(--primary)",
  className,
}: AnimatedBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-md px-4 py-1.5 text-sm overflow-hidden",
        className,
      )}
      style={{ color }}
    >
      {/* animated border sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from var(--angle), transparent 60%, oklch(0.85 0.16 200 / 0.8) 80%, transparent 100%)",
          animation: "badge-rotate 4s linear infinite",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      <span className="relative font-medium tracking-wide">{text}</span>
      <ChevronRight
        size={14}
        className="relative text-primary transition-transform group-hover:translate-x-0.5"
      />
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes badge-rotate {
          to { --angle: 360deg; }
        }
      `}</style>
    </motion.div>
  );
};
