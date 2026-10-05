"use client";

import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { loginAction } from "./actions";

const input =
  "h-12 w-full rounded-lg border border-ink/25 bg-white px-4 text-base outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-[3.25rem] xl1:text-[1.05rem] xl3:h-14 xl3:text-lg";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await loginAction(email, password);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }
    router.push(params.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 xl1:gap-5 xl3:gap-6">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
          required
        />
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/40 bg-danger/5 p-3 text-sm text-danger xl1:p-4 xl1:text-base"
        >
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        <Lock className="size-4" /> {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
