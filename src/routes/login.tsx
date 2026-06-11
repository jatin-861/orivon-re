import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SignInCard } from "@/components/ui/sign-in-card";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <SignInCard
      error={error}
      loading={loading}
      onSubmit={({ username, password }) => {
        setError(null);
        setLoading(true);
        setTimeout(() => {
          if (username === "admin" && password === "1234") {
            try {
              localStorage.setItem("orivon_auth", "1");
            } catch {}
            navigate({ to: "/" });
          } else {
            setError("Invalid credentials. Try admin / 1234.");
          }
          setLoading(false);
        }, 600);
      }}
    />
  );
}
