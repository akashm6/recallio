import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/client"
import { useAuthStore } from "../store/auth"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

export default function Login(){
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [err,setErr] = useState<string|null>(null)
  const [loading,setLoading] = useState(false)
  const login = useAuthStore(s=>s.login)
  const nav = useNavigate()

  const submit = async (e: React.FormEvent)=>{
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try{
      const r = await api.post("/auth/login",{ email,password })
      login(r.data.token)
      nav("/decks")
    }catch{
      setErr("Invalid credentials")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl mb-2">Welcome back</h1>
      <div className="text-sm text-zinc-400 mb-4">Sign in to continue to recallio.</div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-zinc-400">Email</label>
          <Input
            placeholder="you@example.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            className="mt-1"
            required
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400">Password</label>
          <Input
            placeholder="••••••••"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            className="mt-1"
            required
          />
        </div>

        {err && <div className="text-red-400 text-sm">{err}</div>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>

      <div className="mt-3 text-sm">
        Don't have an account? <Link to="/register" className="underline">Create one</Link>
      </div>
    </div>
  )
}
