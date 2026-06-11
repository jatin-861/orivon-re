import { useState, lazy, Suspense } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { MagneticButton } from "../MagneticButton";

const TechStackCanvas = lazy(() => import("../canvas/TechStackCanvas"));

export function ComponentLab() {
  // Glassmorphic states
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(8);

  // Elastic switch states
  const [elasticCheck, setElasticCheck] = useState(false);
  const [switchScale, setSwitchScale] = useState(1);

  const handleSwitchChange = () => {
    setElasticCheck(!elasticCheck);

    // Spring physics bounce
    setSwitchScale(0.85);
    setTimeout(() => {
      setSwitchScale(1.1);
      setTimeout(() => {
        setSwitchScale(1);
      }, 150);
    }, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {/* Widget 1: Magnetic Pull */}
      <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-[var(--card)] shadow-elegant">
        <div>
          <span className="flex items-center gap-2 text-xs font-mono text-[var(--brand-pink)] mb-1">
            <Sparkles size={12} /> Micro-interaction // Attractor
          </span>
          <h3 className="font-serif text-2xl font-normal tracking-tight text-foreground">
            Magnetic Attractor
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            CTAs attract themselves toward cursor coordinates.
          </p>
        </div>

        <div className="flex items-center justify-center min-h-48 border border-border/40 rounded-xl bg-muted/20 relative overflow-hidden">
          <MagneticButton className="rounded-full bg-foreground text-background px-6 py-3.5 text-xs font-mono uppercase font-bold tracking-wider hover:opacity-90">
            <span className="flex items-center gap-2">
              Enter Orbit <ArrowRight size={14} />
            </span>
          </MagneticButton>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
          Uses GSAP tracking on mouse events within an attractor boundaries box to pulls elements
          dynamically, reducing click friction.
        </p>
      </div>

      {/* Widget 2: Glassmorphism Live Customizer */}
      <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-[var(--card)] shadow-elegant">
        <div>
          <span className="flex items-center gap-2 text-xs font-mono text-[var(--brand-pink)] mb-1">
            <Sparkles size={12} /> GPU Rendering // Backdrop Filter
          </span>
          <h3 className="font-serif text-2xl font-normal tracking-tight text-foreground">
            Glassmorphism
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Frost layers allow underlying layout colors to bleed through.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative flex items-center justify-center min-h-32 border border-border/40 rounded-xl bg-muted/20 overflow-hidden">
            {/* Visual background noise color bubbles */}
            <div className="absolute top-4 left-6 h-12 w-12 rounded-full bg-[var(--brand-pink)] opacity-85 filter blur-sm" />
            <div className="absolute bottom-4 right-6 h-12 w-12 rounded-full bg-[var(--brand-teal)] opacity-85 filter blur-sm" />

            {/* Glass container */}
            <div
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                backgroundColor: `rgba(255, 255, 255, ${opacity / 100})`,
                borderColor: `rgba(255, 255, 255, ${opacity / 100 + 0.05})`,
              }}
              className="relative w-4/5 h-20 rounded-xl border flex items-center justify-center font-mono text-[10px] font-bold text-foreground/80 tracking-wider shadow-lg"
            >
              Frosted Layer
            </div>
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-2.5 text-[10px] font-mono text-muted-foreground">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="blur-slide" className="w-16">
                Blur ({blur}px)
              </label>
              <input
                id="blur-slide"
                type="range"
                min="0"
                max="25"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                className="flex-1 h-0.5 bg-border rounded-full appearance-none cursor-pointer accent-[var(--brand-teal)]"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="opacity-slide" className="w-16">
                Opacity ({opacity}%)
              </label>
              <input
                id="opacity-slide"
                type="range"
                min="0"
                max="45"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
                className="flex-1 h-0.5 bg-border rounded-full appearance-none cursor-pointer accent-[var(--brand-teal)]"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
          Adjust sliders to observe overlay blend logic. Uses CSS backdrop-filters for smooth GPU
          compositing.
        </p>
      </div>

      {/* Widget 3: Elastic Switch */}
      <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-[var(--card)] shadow-elegant">
        <div>
          <span className="flex items-center gap-2 text-xs font-mono text-[var(--brand-pink)] mb-1">
            <Sparkles size={12} /> Animation Physics // Spring Toggle
          </span>
          <h3 className="font-serif text-2xl font-normal tracking-tight text-foreground">
            Tactile Switches
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Spring forces create elasticity inside digital buttons.
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center justify-center min-h-48 border border-border/40 rounded-xl bg-muted/20">
          <div
            onClick={handleSwitchChange}
            style={{ transform: `scale(${switchScale})` }}
            className={`relative w-16 h-9 rounded-full border border-border/80 cursor-pointer transition-all duration-300 p-1 flex items-center ${
              elasticCheck ? "bg-[var(--brand-pink)] border-transparent" : "bg-muted/60"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                elasticCheck ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground">
            SYSTEM STATUS: {elasticCheck ? "ACTIVE" : "STANDBY"}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
          State toggles compress and expand utilizing spring-damper scaling. Simulates tactile
          resistance inside layout clicks.
        </p>
      </div>

      {/* Widget 4: GPU 3D Swarm Physics */}
      <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-[var(--card)] shadow-elegant">
        <div>
          <span className="flex items-center gap-2 text-xs font-mono text-[var(--brand-pink)] mb-1">
            <Sparkles size={12} /> WebGL Physics // 3D Swarm
          </span>
          <h3 className="font-serif text-2xl font-normal tracking-tight text-foreground">
            Kinetic Tech Stack
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            3D technology logo spheres reacting to cursor repulsion forces.
          </p>
        </div>

        <div className="relative flex items-center justify-center min-h-48 border border-border/40 rounded-xl bg-neutral-950 overflow-hidden">
          <Suspense fallback={<div className="absolute inset-0 bg-neutral-950/20 animate-pulse" />}>
            <TechStackCanvas />
          </Suspense>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
          Simulates dynamic gravity clustering combined with cursor boundary collision in an
          interactive 3D WebGL viewport.
        </p>
      </div>
    </div>
  );
}
