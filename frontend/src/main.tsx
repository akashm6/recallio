import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./index.css"
import App from "./App"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Decks from "./pages/Decks"
import Review from "./pages/Review"
import Dashboard from "./pages/Dashboard"
import { useAuthStore } from "./store/auth"

function Guard({ children }:{ children: React.ReactNode }){
  const token = useAuthStore(s=>s.token)
  if(!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/decks" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="decks" element={<Guard><Decks /></Guard>} />
          <Route path="review/:deckId" element={<Guard><Review /></Guard>} />
          <Route path="dashboard" element={<Guard><Dashboard /></Guard>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
