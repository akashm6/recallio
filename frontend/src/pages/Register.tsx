import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuthStore } from "../store/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await api.post("/auth/register", { email, password });
      login(r.data.token);
      nav("/decks");
    } catch {
      setErr("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl mb-2">Create account</h1>
      <div className="text-sm text-zinc-400 mb-4">
        Join recallio and start learning faster.
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-zinc-400">Email</label>
          <Input
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            className="mt-1"
            required
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400">Password</label>
          <Input
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            className="mt-1"
            required
          />
        </div>

        {err && <div className="text-red-400 text-sm">{err}</div>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>

      <div className="mt-3 text-sm">
        Have an account?{" "}
        <Link to="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
