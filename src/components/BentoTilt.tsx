import React, { useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

interface BentoTiltProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoTilt = ({ children, className = "" }: BentoTiltProps) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: "transform 0.1s ease-out" }}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  src?: string;
  title: React.ReactNode;
  description?: string;
  isComingSoon?: boolean;
  children?: React.ReactNode;
}

export const BentoCard = ({ src, title, description, isComingSoon, children }: BentoCardProps) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const [buttonCursorPosition, setButtonCursorPosition] = useState({ x: 0, y: 0 });
  const [buttonHoverOpacity, setButtonHoverOpacity] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const hoverButtonRef = useRef<HTMLDivElement>(null);

  const handleCardMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleButtonMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setButtonCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={() => setHoverOpacity(1)}
      onMouseLeave={() => setHoverOpacity(0)}
      className="relative w-full h-full overflow-hidden rounded-xl border border-border bg-card"
    >
      {children ? (
        <div className="absolute inset-0 w-full h-full z-0">{children}</div>
      ) : src ? (
        <video
          src={src}
          loop
          muted
          autoPlay
          playsInline
          className="absolute left-0 top-0 w-full h-full object-cover object-center filter grayscale contrast-[1.05] opacity-90 transition-all duration-700 hover:grayscale-0 hover:contrast-100"
        />
      ) : null}

      {/* Whole-card subtle radial spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-10"
        style={{
          opacity: hoverOpacity * 0.12,
          background: `radial-gradient(400px circle at ${cursorPosition.x}px ${cursorPosition.y}px, var(--cyan-glow, #00ffff), transparent)`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-card/85 via-card/20 to-transparent pointer-events-none z-10" />

      <div className="absolute inset-0 z-20 flex w-full h-full flex-col justify-between p-6 text-foreground pointer-events-none">
        <div className="pointer-events-none">
          <h3 className="text-3xl font-serif tracking-tight">{title}</h3>
          {description && (
            <p className="mt-3 max-w-xs font-sans text-xs md:text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleButtonMouseMove}
            onMouseEnter={() => setButtonHoverOpacity(1)}
            onMouseLeave={() => setButtonHoverOpacity(0)}
            className="relative z-30 flex w-fit cursor-pointer items-center gap-1.5 overflow-hidden rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-wider font-mono text-foreground pointer-events-auto shadow-sm"
          >
            {/* Radial gradient hover effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: buttonHoverOpacity,
                background: `radial-gradient(80px circle at ${buttonCursorPosition.x}px ${buttonCursorPosition.y}px, var(--cyan-glow), transparent)`,
              }}
            />
            <ArrowUpRight className="relative z-20 h-3.5 w-3.5 text-secondary" />
            <span className="relative z-20">Coming Soon</span>
          </div>
        )}
      </div>
    </div>
  );
};
