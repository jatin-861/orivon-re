import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "relative group border text-foreground mx-auto text-center rounded-full inline-flex items-center justify-center gap-2 transition-all duration-300 font-semibold",
  {
    variants: {
      variant: {
        default:
          "bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-foreground",
        solid:
          "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent shadow-glow-cyan",
        ghost:
          "border-transparent bg-transparent hover:border-primary/40 hover:bg-primary/5 text-foreground",
      },
      size: {
        default: "px-7 py-2.5 text-sm",
        sm: "px-4 py-1.5 text-xs",
        lg: "px-10 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  neon?: boolean;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, neon = true, size, variant, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
        <span
          className={cn(
            "absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-primary to-transparent hidden",
            neon && "block",
          )}
        />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        <span
          className={cn(
            "absolute group-hover:opacity-60 opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-primary to-transparent hidden",
            neon && "block",
          )}
        />
      </button>
    );
  },
);
NeonButton.displayName = "NeonButton";

export { buttonVariants as neonButtonVariants };
