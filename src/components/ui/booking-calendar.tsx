"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function BookingCalendar({ className }: { className?: string }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState<number | null>(null);

  const monthName = new Date(view.year, view.month, 1).toLocaleString("default", { month: "long" });
  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const cells = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  const isToday = (d: number) =>
    d === today.getDate() && view.month === today.getMonth() && view.year === today.getFullYear();

  const isPast = (d: number) => {
    const date = new Date(view.year, view.month, d);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const move = (delta: number) => {
    const m = view.month + delta;
    const y = view.year + Math.floor(m / 12);
    setView({ year: y, month: ((m % 12) + 12) % 12 });
    setSelected(null);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border glass p-6",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-1">Book a call</p>
          <h3 className="font-display text-xl font-bold">
            {monthName} {view.year}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => move(-1)}
            aria-label="Previous month"
            className="rounded-full p-2 hover:bg-primary/10 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => move(1)}
            aria-label="Next month"
            className="rounded-full p-2 hover:bg-primary/10 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative grid grid-cols-7 gap-1.5 text-center">
        {DAYS.map((d) => (
          <div key={d} className="text-[10px] tracking-widest text-muted-foreground py-2">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} />;
          const past = isPast(d);
          const sel = selected === d;
          return (
            <motion.button
              key={d}
              whileHover={!past ? { scale: 1.06 } : undefined}
              whileTap={!past ? { scale: 0.94 } : undefined}
              disabled={past}
              onClick={() => setSelected(d)}
              className={cn(
                "aspect-square rounded-lg text-sm transition-all relative",
                past && "text-muted-foreground/40 cursor-not-allowed",
                !past && !sel && "hover:bg-primary/10 text-foreground",
                sel && "bg-primary text-primary-foreground shadow-glow-cyan font-semibold",
                isToday(d) && !sel && "ring-1 ring-primary/50",
              )}
            >
              {d}
            </motion.button>
          );
        })}
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3 pt-5 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={14} className="text-primary" />
          <span>30 min intro call</span>
        </div>
        <button
          disabled={!selected}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-all",
            selected
              ? "bg-primary text-primary-foreground shadow-glow-cyan hover:scale-105"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {selected ? `Book ${monthName} ${selected}` : "Pick a date"}
        </button>
      </div>
    </div>
  );
}
