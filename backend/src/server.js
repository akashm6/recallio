import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import morgan from "morgan"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js"
import deckRoutes from "./routes/decks.js"
import cardRoutes from "./routes/cards.js"
import searchRoutes from "./routes/search.js"
import statsRoutes from "./routes/stats.js"
import helmet from "helmet"

const app = express()
const ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",")

app.use(cors({ origin: ORIGINS, credentials: true }))
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(express.json({ limit: "1mb" }))
app.use(morgan("dev"))

app.use("/api/auth", authRoutes)
app.use("/api/decks", deckRoutes)
app.use("/api/cards", cardRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/stats", statsRoutes)

// health check endpoint
app.get("/api/health", (req,res)=>{
  res.json({ ok: true, time: new Date().toISOString() })
})

const uri = process.env.MONGODB_URI
await mongoose.connect(uri)
app.listen(process.env.PORT || 4000)
