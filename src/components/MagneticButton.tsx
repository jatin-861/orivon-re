import { forwardRef, useEffect, useRef, type ReactNode, type ElementType } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  [key: string]: any;
};

export const MagneticButton = forwardRef<HTMLElement, Props>(
  ({ as: Component = "button", className, children, ...rest }, fwdRef) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const ctx = gsap.context(() => {
        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, {
            x: x * 0.35,
            y: y * 0.35,
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out",
          });
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.4)" });
        };
        el.addEventListener("mousemove", onMove as any);
        el.addEventListener("mouseleave", onLeave);
        return () => {
          el.removeEventListener("mousemove", onMove as any);
          el.removeEventListener("mouseleave", onLeave);
        };
      }, el);
      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (ref as any).current = node;
          if (typeof fwdRef === "function") fwdRef(node);
          else if (fwdRef) (fwdRef as any).current = node;
        }}
        className={cn("inline-block cursor-pointer will-change-transform", className)}
        data-magnetic="true"
        {...rest}
      >
        {children}
      </Component>
    );
  },
);
MagneticButton.displayName = "MagneticButton";
