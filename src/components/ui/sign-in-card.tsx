"use client";

import { useState, type FormEvent } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onSubmit?: (creds: { username: string; password: string }) => void;
  error?: string | null;
  loading?: boolean;
};

export function SignInCard({ onSubmit, error, loading }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"u" | "p" | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-200, 200], [8, -8]);
  const rotateY = useTransform(mouseX, [-200, 200], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.({ username, password });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-md"
      >
        <div className="relative rounded-2xl border border-border bg-card p-8 shadow-elegant">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-[var(--muted)]">
              <span className="font-serif text-2xl text-foreground">O</span>
            </div>
            <h1 className="font-serif text-3xl font-normal">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to continue to <span className="text-foreground">Orivon Studio</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <Mail
                size={16}
                className={cn(
                  "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                  focused === "u" ? "text-primary" : "text-muted-foreground",
                )}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused("u")}
                onBlur={() => setFocused(null)}
                placeholder="Username"
                autoComplete="username"
                className="h-11 w-full rounded-xl border border-border bg-background/40 pl-10 pr-3 text-sm transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={16}
                className={cn(
                  "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                  focused === "p" ? "text-primary" : "text-muted-foreground",
                )}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("p")}
                onBlur={() => setFocused(null)}
                placeholder="Password"
                autoComplete="current-password"
                className="h-11 w-full rounded-xl border border-border bg-background/40 pl-10 pr-10 text-sm transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
              >
                {error}
              </motion.p>
            )}

            <p className="text-xs text-muted-foreground">
              Demo credentials: <span className="text-foreground">admin</span> /{" "}
              <span className="text-foreground">1234</span>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-200 ease-out hover:bg-[var(--secondary)] active:scale-[0.97] disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <>
                  Sign in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
