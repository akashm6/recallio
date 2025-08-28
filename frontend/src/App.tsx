import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "./store/auth"
import { Button } from "./components/ui/button"
import { cn } from "./lib/utils"
import { LayoutDashboard, Layers3, LogIn, LogOut } from "lucide-react"

export default function App(){
  const { token, logout } = useAuthStore()
  const nav = useNavigate()
  const loc = useLocation()

  const isAuthRoute = loc.pathname.startsWith("/login") || loc.pathname.startsWith("/register")

  return (
    <div className="min-h-screen">
      <header className={cn(
        "sticky top-0 z-40 border-b border-zinc-800/60 bg-black/40 backdrop-blur",
        isAuthRoute ? "bg-transparent border-transparent" : ""
      )}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-2xl bg-white" />
            <Link to={token ? "/decks" : "/"} className="text-lg font-semibold">recallio</Link>
            {token && (
              <nav className="ml-4 hidden md:flex items-center gap-1">
                <Link to="/decks" className={cn("px-3 py-1.5 rounded-2xl text-sm", loc.pathname.startsWith("/decks") ? "bg-zinc-900" : "hover:bg-zinc-900/60")}>Decks</Link>
                <Link to="/dashboard" className={cn("px-3 py-1.5 rounded-2xl text-sm", loc.pathname.startsWith("/dashboard") ? "bg-zinc-900" : "hover:bg-zinc-900/60")}>Dashboard</Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!token && <Button variant="secondary" size="sm" onClick={()=>nav("/login")}><LogIn className="h-4 w-4 mr-2"/>Login</Button>}
            {!token && <Button size="sm" onClick={()=>nav("/register")}>Register</Button>}
            {token && <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4 mr-2"/>Logout</Button>}
          </div>
        </div>
      </header>

      <main className={cn(
        "max-w-6xl mx-auto px-4 py-6",
        isAuthRoute ? "max-w-none px-0 py-0" : ""
      )}>
        <Outlet />
      </main>

      {token && (
        <div className="fixed bottom-6 right-6 hidden md:flex gap-2">
          <Link to="/dashboard"><Button variant="secondary" size="lg"><LayoutDashboard className="h-5 w-5 mr-2"/>Progress</Button></Link>
          <Link to="/decks"><Button size="lg"><Layers3 className="h-5 w-5 mr-2"/>Decks</Button></Link>
        </div>
      )}
    </div>
  )
}
