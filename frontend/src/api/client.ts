import axios from "axios"
import { useAuthStore } from "../store/auth"

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

api.interceptors.request.use(cfg=>{
  const token = useAuthStore.getState().token
  if(token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
