import { Router } from "express"
import { requireAuth } from "../middleware/auth.js"
import Deck from "../models/Deck.js"
import Card from "../models/Card.js"

const r = Router()
r.use(requireAuth)

r.get("/", async (req,res)=>{
  const q = (req.query.q || "").toString()
  if(!q) return res.json({ decks: [], cards: [] })
  const decks = await Deck.find({ userId: req.userId, title: { $regex: q, $options: "i" } }).limit(20)
  const cards = await Card.find({ front: { $regex: q, $options: "i" } }).limit(50)
  res.json({ decks, cards })
})

export default r
