import { useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DockItemData {
  link: string;
  Icon: ReactNode;
  external?: boolean;
  label?: string;
}

export interface AnimatedDockProps {
  className?: string;
  items: DockItemData[];
}

export const AnimatedDock = ({ className, items }: AnimatedDockProps) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 items-end gap-3 rounded-2xl glass border border-primary/20 shadow-glow-cyan px-4 pb-3",
        className,
      )}
    >
      {items.map((item, i) => (
        <DockItem key={i} mouseX={mouseX} item={item} />
      ))}
    </motion.div>
  );
};

const DockItem = ({ mouseX, item }: { mouseX: MotionValue<number>; item: DockItemData }) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconScale = useTransform(width, [40, 80], [1, 1.5]);
  const iconSpring = useSpring(iconScale, { mass: 0.1, stiffness: 150, damping: 12 });

  const inner = (
    <motion.div
      style={{ scale: iconSpring }}
      className="flex items-center justify-center w-full h-full text-primary-foreground"
      aria-label={item.label}
    >
      {item.Icon}
    </motion.div>
  );

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow-cyan"
    >
      {item.external ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer noopener"
          className="grow flex items-center justify-center w-full h-full"
        >
          {inner}
        </a>
      ) : (
        <Link
          to={item.link as string}
          className="grow flex items-center justify-center w-full h-full"
        >
          {inner}
        </Link>
      )}
    </motion.div>
  );
};
