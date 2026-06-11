import { useState } from "react";
import { Sparkles } from "lucide-react";

type Mode = "normal" | "proximity" | "similarity" | "continuity";

export function GestaltVisualizer() {
  const [mode, setMode] = useState<Mode>("normal");

  const getDotStyle = (idx: number): React.CSSProperties => {
    const style: React.CSSProperties = {
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      backgroundColor: "var(--color-muted-foreground)",
      transition:
        "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.6s ease, border-radius 0.6s ease, opacity 0.6s ease",
    };

    const row = Math.floor(idx / 4);
    const col = idx % 4;

    switch (mode) {
      case "proximity":
        // Shift columns and rows closer into two groups
        const shiftX = col >= 2 ? 14 : -6;
        const shiftY = row >= 2 ? 14 : -6;
        style.transform = `translate(${shiftX}px, ${shiftY}px)`;
        break;

      case "similarity":
        // Alternate shapes and colors
        if (idx % 2 === 0) {
          style.backgroundColor = "var(--brand-pink)";
          style.borderRadius = "4px"; // square
        } else if (idx % 3 === 0) {
          style.backgroundColor = "var(--brand-teal)";
        }
        break;

      case "continuity":
        // Highlight diagonal alignment curve, dim other points
        const isDiagonal = row === col;
        if (isDiagonal) {
          style.backgroundColor = "var(--brand-lavender)";
          style.transform = "scale(1.25)";
          style.opacity = 1;
        } else {
          style.opacity = 0.25;
        }
        break;

      default:
        // normal
        break;
    }

    return style;
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-[var(--card)] shadow-elegant">
      <div>
        <span className="flex items-center gap-2 text-xs font-mono text-[var(--brand-pink)] mb-1">
          <Sparkles size={12} /> Gestalt laws // Visual psychology
        </span>
        <h3 className="font-serif text-2xl font-normal tracking-tight text-foreground">
          Gestalt Grouping
        </h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          The human brain aggregates separate visual inputs into structural groupings.
        </p>
      </div>

      <div className="flex flex-col gap-6 items-center">
        {/* Controls */}
        <div className="flex gap-1.5 p-1 bg-muted/40 rounded-full border border-border/80 text-[10px] font-mono">
          {(["normal", "proximity", "similarity", "continuity"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-full uppercase font-bold tracking-wider cursor-pointer transition-colors ${
                mode === m
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* 4x4 Grid viewport */}
        <div className="flex items-center justify-center h-48 w-full border border-border/40 rounded-xl bg-muted/20">
          <div className="grid grid-cols-4 grid-rows-4 gap-6 w-36 h-36">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-center">
                <div style={getDotStyle(idx)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
        Toggling states illustrates how proximity overrides grid lines, how similarity groups
        objects, and how continuous lines guide visual tracks.
      </p>
    </div>
  );
}
