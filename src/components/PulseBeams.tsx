import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeamPath {
  path: string;
  gradientConfig: {
    initial: { x1: string; x2: string; y1: string; y2: string };
    animate: {
      x1: string | string[];
      x2: string | string[];
      y1: string | string[];
      y2: string | string[];
    };
    transition?: Record<string, unknown>;
  };
  connectionPoints?: Array<{ cx: number; cy: number; r: number }>;
}

interface PulseBeamsProps {
  children?: ReactNode;
  className?: string;
  background?: ReactNode;
  beams: BeamPath[];
  width?: number;
  height?: number;
  baseColor?: string;
  accentColor?: string;
  gradientColors?: { start: string; middle: string; end: string };
}

export const PulseBeams = ({
  children,
  className,
  background,
  beams,
  width = 858,
  height = 434,
  baseColor = "oklch(1 0 0 / 0.08)",
  accentColor = "oklch(0.85 0.16 200 / 0.6)",
  gradientColors = { start: "#5EE7FF", middle: "#22D3EE", end: "#A78BFA" },
}: PulseBeamsProps) => {
  return (
    <div
      className={cn("relative flex items-center justify-center mx-auto overflow-hidden", className)}
      style={{ minHeight: height }}
    >
      {background}
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <SVGs
          beams={beams}
          width={width}
          height={height}
          baseColor={baseColor}
          accentColor={accentColor}
          gradientColors={gradientColors}
        />
      </div>
    </div>
  );
};

const SVGs = ({
  beams,
  width,
  height,
  baseColor,
  accentColor,
  gradientColors,
}: {
  beams: BeamPath[];
  width: number;
  height: number;
  baseColor: string;
  accentColor: string;
  gradientColors: { start: string; middle: string; end: string };
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-full"
    >
      {beams.map((beam, index) => (
        <g key={`base-${index}`}>
          <path d={beam.path} stroke={baseColor} strokeWidth="1" />
          <path
            d={beam.path}
            stroke={`url(#grad-${index})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {beam.connectionPoints?.map((p, pi) => (
            <circle
              key={pi}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill="oklch(0.13 0.02 240)"
              stroke={accentColor}
              strokeWidth="1.5"
            />
          ))}
        </g>
      ))}
      <defs>
        {beams.map((beam, index) => (
          <motion.linearGradient
            key={`grad-${index}`}
            id={`grad-${index}`}
            initial={beam.gradientConfig.initial}
            animate={beam.gradientConfig.animate}
            transition={beam.gradientConfig.transition as never}
          >
            <stop stopColor={gradientColors.start} stopOpacity="0" />
            <stop stopColor={gradientColors.start} />
            <stop offset="0.325" stopColor={gradientColors.middle} />
            <stop offset="1" stopColor={gradientColors.end} stopOpacity="0" />
          </motion.linearGradient>
        ))}
      </defs>
    </svg>
  );
};
