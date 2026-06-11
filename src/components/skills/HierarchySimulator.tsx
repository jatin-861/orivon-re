import { useState } from "react";
import { Sparkles } from "lucide-react";

export function HierarchySimulator() {
  const [val, setVal] = useState(15);

  const getCardStyle = (): React.CSSProperties => {
    if (val < 25) {
      return {
        background: "rgba(0,0,0,0.01)",
        border: "1px solid transparent",
        padding: "4px",
      };
    } else if (val < 65) {
      return {
        background: "rgba(0,0,0,0.03)",
        border: "1px solid var(--border)",
        padding: "16px",
      };
    } else {
      return {
        background: "var(--card)",
        border: "1px solid var(--brand-pink)",
        padding: "24px",
        boxShadow: "var(--shadow-elegant)",
      };
    }
  };

  const getTagStyle = (): React.CSSProperties => {
    if (val < 25) {
      return {
        color: "#777",
        fontSize: "0.85rem",
        fontWeight: "normal",
        textTransform: "none",
        letterSpacing: "normal",
        marginBottom: "2px",
        display: "inline-block",
      };
    } else if (val < 65) {
      return {
        color: "var(--muted-foreground)",
        backgroundColor: "var(--muted)",
        fontSize: "0.65rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        padding: "2px 6px",
        borderRadius: "4px",
        marginBottom: "6px",
        display: "inline-block",
      };
    } else {
      return {
        color: "#ffffff",
        backgroundColor: "var(--brand-pink)",
        fontSize: "0.625rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        padding: "3px 8px",
        borderRadius: "4px",
        marginBottom: "12px",
        display: "inline-block",
        boxShadow: "var(--shadow-glow-cyan)",
      };
    }
  };

  const getTitleStyle = (): React.CSSProperties => {
    if (val < 25) {
      return {
        fontSize: "0.85rem",
        fontWeight: "normal",
        color: "#666",
        lineHeight: "1",
        marginBottom: "2px",
        fontFamily: "var(--font-sans)",
      };
    } else if (val < 65) {
      return {
        fontSize: "1.15rem",
        fontWeight: "600",
        color: "var(--foreground)",
        lineHeight: "1.3",
        marginBottom: "6px",
        fontFamily: "var(--font-sans)",
      };
    } else {
      return {
        fontSize: "1.6rem",
        fontWeight: "normal",
        color: "var(--foreground)",
        lineHeight: "1.15",
        marginBottom: "10px",
        fontFamily: "var(--font-serif)",
      };
    }
  };

  const getBodyStyle = (): React.CSSProperties => {
    if (val < 25) {
      return {
        fontSize: "0.85rem",
        lineHeight: "1",
        color: "#888",
      };
    } else if (val < 65) {
      return {
        fontSize: "0.85rem",
        lineHeight: "1.4",
        color: "var(--muted-foreground)",
      };
    } else {
      return {
        fontSize: "0.95rem",
        lineHeight: "1.65",
        color: "var(--muted-foreground)",
      };
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-[var(--card)] shadow-elegant h-full">
      <div>
        <span className="flex items-center gap-2 text-xs font-mono text-[var(--brand-pink)] mb-1">
          <Sparkles size={12} /> Visual scale // Typographic contrast
        </span>
        <h3 className="font-serif text-2xl font-normal tracking-tight text-foreground">
          Typographic Rhythm
        </h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Typographic contrast establishes reading direction and relieves cognitive strain.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Slider */}
        <div className="flex items-center gap-4 bg-muted/40 p-3 rounded-xl border border-border/60">
          <label
            htmlFor="range-input"
            className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider"
          >
            Layout Polish
          </label>
          <input
            id="range-input"
            type="range"
            min="0"
            max="100"
            value={val}
            onChange={(e) => setVal(parseInt(e.target.value, 10))}
            className="flex-1 h-1 bg-border rounded-full appearance-none cursor-pointer accent-[var(--brand-pink)]"
          />
          <span className="text-[10px] font-mono font-bold w-8 text-right">{val}%</span>
        </div>

        {/* Live Preview Frame */}
        <div className="flex items-center justify-center p-6 border border-border/40 rounded-xl bg-muted/20 min-h-60">
          <div style={getCardStyle()} className="w-full rounded-xl transition-all duration-300">
            <span style={getTagStyle()}>
              {val < 25 ? "tag index" : val < 65 ? "Insight" : "INSIGHT"}
            </span>
            <h4 style={getTitleStyle()}>Cognitive Load Index</h4>
            <p style={getBodyStyle()}>
              Good typographic styling establishes hierarchy, reducing immediate mental drag and
              clarifying information priority.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40 mt-auto">
        Watch margins expand, sizes scale, fonts transition to Bodoni Moda, and contrast jump as
        polish index improves.
      </p>
    </div>
  );
}
