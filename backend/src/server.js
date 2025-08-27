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

const app = express()
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }))
app.use(express.json({ limit: "1mb" }))
app.use(morgan("dev"))

app.use("/api/auth", authRoutes)
app.use("/api/decks", deckRoutes)
app.use("/api/cards", cardRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/stats", statsRoutes)

const uri = process.env.MONGODB_URI
await mongoose.connect(uri)
app.listen(process.env.PORT || 4000)
