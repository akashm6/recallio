import { create } from "zustand"

type User = { email: string } | null

type AuthState = {
  token: string | null
  user: User
  login: (t:string)=>void
  logout: ()=>void
}

export const useAuthStore = create<AuthState>((set)=>{
  const t = localStorage.getItem("token")
  return {
    token: t,
    user: null,
    login: (token)=>{ localStorage.setItem("token", token); set({ token }) },
    logout: ()=>{ localStorage.removeItem("token"); set({ token: null, user: null }) }
  }
})
