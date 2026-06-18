import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "relative group border text-foreground mx-auto text-center rounded-full inline-flex items-center justify-center gap-2 transition-all duration-200 ease-out active:scale-[0.97] font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-primary/5 hover:bg-[var(--secondary)] hover:text-primary-foreground hover:border-[var(--secondary)] border-primary/20 text-foreground",
        solid: "bg-primary hover:bg-[var(--secondary)] text-primary-foreground border-transparent",
        ghost:
          "border-transparent bg-transparent hover:border-[var(--secondary)]/40 hover:bg-primary/5 text-foreground",
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
  as?: React.ElementType;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, size, variant, children, as, ...props }, ref) => {
    const Component = (as ?? "button") as "button";
    return React.createElement(
      Component,
      {
        ref,
        className: cn(buttonVariants({ variant, size }), className),
        "data-magnetic": "true",
        ...props,
      },
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>,
    );
  },
);
NeonButton.displayName = "NeonButton";

export { buttonVariants as neonButtonVariants };
