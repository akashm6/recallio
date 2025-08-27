import { Router } from "express"
import { z } from "zod"
import Deck from "../models/Deck.js"
import Card from "../models/Card.js"
import ReviewLog from "../models/ReviewLog.js"
import { requireAuth } from "../middleware/auth.js"

const r = Router()
r.use(requireAuth)

function clamp(v,min,max){ return Math.max(min, Math.min(max,v)) }

function schedule(card, grade){
  let ease = card.ease || 2.5
  let interval = card.interval || 0
  let streak = card.streak || 0
  const now = new Date()
  if(grade===0){
    streak = 0
    ease = clamp(ease - 0.2, 1.3, 2.7)
    interval = 1
  }else if(grade===1){
    streak += 1
    ease = clamp(ease - 0.15, 1.3, 3.0)
    interval = Math.max(1, Math.round(interval ? interval*1.2 : 1))
  }else if(grade===2){
    streak += 1
    if(streak===1) interval = 1
    else if(streak===2) interval = 6
    else interval = Math.round(interval * ease)
  }else if(grade===3){
    streak += 1
    ease = clamp(ease + 0.15, 1.3, 3.5)
    if(streak===1) interval = 2
    else if(streak===2) interval = 8
    else interval = Math.round(interval * ease * 1.3)
  }
  const dueAt = new Date(now.getTime() + interval*60*1000)
  return { ease, interval, streak, dueAt }
}

r.post("/", async (req,res)=>{
  const schema = z.object({ deckId: z.string(), front: z.string().min(1), back: z.string().min(1) })
  const data = schema.parse(req.body)
  const deck = await Deck.findOne({ _id: data.deckId, userId: req.userId })
  if(!deck) return res.status(404).json({ error: "not_found" })
  const card = await Card.create({ deckId: deck._id, front: data.front, back: data.back })
  res.json(card)
})

r.patch("/:id", async (req,res)=>{
  const schema = z.object({ front: z.string().optional(), back: z.string().optional(), dueAt: z.string().optional() })
  const data = schema.parse(req.body)
  const card = await Card.findById(req.params.id).populate("deckId")
  if(!card) return res.status(404).json({ error: "not_found" })
  const deck = await Deck.findOne({ _id: card.deckId, userId: req.userId })
  if(!deck) return res.status(403).json({ error: "forbidden" })
  if(data.front!==undefined) card.front = data.front
  if(data.back!==undefined) card.back = data.back
  if(data.dueAt!==undefined) card.dueAt = new Date(data.dueAt)
  await card.save()
  res.json(card)
})

r.delete("/:id", async (req,res)=>{
  const card = await Card.findById(req.params.id).populate("deckId")
  if(!card) return res.status(404).json({ error: "not_found" })
  const deck = await Deck.findOne({ _id: card.deckId, userId: req.userId })
  if(!deck) return res.status(403).json({ error: "forbidden" })
  await card.deleteOne()
  res.json({ ok: true })
})

r.post("/:id/review", async (req,res)=>{
  const schema = z.object({ grade: z.number().int().min(0).max(3) })
  const data = schema.parse(req.body)
  const card = await Card.findById(req.params.id).populate("deckId")
  if(!card) return res.status(404).json({ error: "not_found" })
  const deck = await Deck.findOne({ _id: card.deckId, userId: req.userId })
  if(!deck) return res.status(403).json({ error: "forbidden" })
  const next = schedule(card, data.grade)
  card.ease = next.ease
  card.interval = next.interval
  card.streak = next.streak
  card.dueAt = next.dueAt
  await card.save()
  await ReviewLog.create({ userId: req.userId, deckId: deck._id, cardId: card._id, grade: data.grade })
  res.json(card)
})

export default r
