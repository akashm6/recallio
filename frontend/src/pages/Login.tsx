import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/client"
import { useAuthStore } from "../store/auth"

export default function Login(){
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [err,setErr] = useState<string|null>(null)
  const login = useAuthStore(s=>s.login)
  const nav = useNavigate()
  const submit = async (e:any)=>{
    e.preventDefault()
    try{
      const r = await api.post("/auth/login",{ email,password })
      login(r.data.token)
      nav("/decks")
    }catch(e:any){
      setErr("Invalid credentials")
    }
  }
  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input className="px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="px-3 py-2 bg-gray-900 border border-gray-700 rounded" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-red-400 text-sm">{err}</div>}
        <button className="px-3 py-2 bg-white text-black rounded">Login</button>
      </form>
      <div className="mt-3 text-sm">No account? <Link to="/register" className="underline">Register</Link></div>
    </div>
  )
}
