import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClass?: string;
}

export const Button = ({
  id,
  title,
  leftIcon,
  rightIcon,
  containerClass,
  ...props
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={cn(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-primary text-primary-foreground px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all duration-200 ease-out hover:bg-secondary active:scale-[0.97]",
        containerClass,
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {leftIcon}

        <span className="relative inline-flex overflow-hidden">
          <span className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-[160%] group-hover:skew-y-12">
            {title}
          </span>
          <span className="absolute left-0 inline-block translate-y-[164%] skew-y-12 transition-transform duration-500 ease-out group-hover:translate-y-0 group-hover:skew-y-0 whitespace-nowrap">
            {title}
          </span>
        </span>

        {rightIcon}
      </span>
    </button>
  );
};

export default Button;
