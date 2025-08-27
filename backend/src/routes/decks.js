import { Router } from "express"
import { z } from "zod"
import Deck from "../models/Deck.js"
import Card from "../models/Card.js"
import { requireAuth } from "../middleware/auth.js"
import { stringify } from "csv-stringify"
import multer from "multer"
import { parse } from "csv-parse"

const upload = multer()
const r = Router()
r.use(requireAuth)

r.get("/", async (req,res)=>{
  const decks = await Deck.find({ userId: req.userId }).sort({ updatedAt: -1 })
  res.json(decks)
})

r.get("/summary", async (req,res)=>{
  const decks = await Deck.find({ userId: req.userId }).sort({ updatedAt: -1 })
  const now = new Date()
  const ids = decks.map(d=>d._id)
  const counts = await Card.aggregate([
    { $match: { deckId: { $in: ids } } },
    { $group: { _id: "$deckId", total: { $sum: 1 }, due: { $sum: { $cond: [{ $lte: ["$dueAt", now] }, 1, 0] } } } }
  ])
  const map = new Map(counts.map(c=>[String(c._id), c]))
  const out = decks.map(d=>{
    const c = map.get(String(d._id)) || { total: 0, due: 0 }
    return { _id: d._id, title: d.title, tags: d.tags, total: c.total, due: c.due }
  })
  res.json(out)
})

r.post("/", async (req,res)=>{
  const schema = z.object({ title: z.string().min(1), tags: z.array(z.string()).optional() })
  const data = schema.parse(req.body)
  const deck = await Deck.create({ userId: req.userId, title: data.title, tags: data.tags || [] })
  res.json(deck)
})

r.get("/:id", async (req,res)=>{
  const deck = await Deck.findOne({ _id: req.params.id, userId: req.userId })
  if(!deck) return res.status(404).json({ error: "not_found" })
  res.json(deck)
})

r.delete("/:id", async (req,res)=>{
  const deck = await Deck.findOneAndDelete({ _id: req.params.id, userId: req.userId })
  if(!deck) return res.status(404).json({ error: "not_found" })
  await Card.deleteMany({ deckId: deck._id })
  res.json({ ok: true })
})

r.get("/:id/queue", async (req,res)=>{
  const deck = await Deck.findOne({ _id: req.params.id, userId: req.userId })
  if(!deck) return res.status(404).json({ error: "not_found" })
  const now = new Date()
  const ahead = Math.max(0, Number(req.query.ahead || 0))
  if(ahead>0){
    const rows = await Card.find({ deckId: deck._id }).sort({ dueAt: 1 }).limit(ahead)
    return res.json(rows)
  }
  const due = await Card.find({ deckId: deck._id, dueAt: { $lte: now } }).sort({ dueAt: 1 }).limit(100)
  res.json(due)
})

r.get("/:id/export", async (req,res)=>{
  const deck = await Deck.findOne({ _id: req.params.id, userId: req.userId })
  if(!deck) return res.status(404).json({ error: "not_found" })
  const cards = await Card.find({ deckId: deck._id })
  res.setHeader("Content-Type","text/csv")
  res.setHeader("Content-Disposition",`attachment; filename="deck-${deck._id}.csv"`)
  const stringifier = stringify({ header: true, columns: ["front","back","ease","interval","dueAt","streak"] })
  stringifier.pipe(res)
  for(const c of cards){
    stringifier.write([c.front,c.back,c.ease,c.interval,c.dueAt.toISOString(),c.streak])
  }
  stringifier.end()
})

r.post("/:id/import", upload.single("file"), async (req,res)=>{
  const deck = await Deck.findOne({ _id: req.params.id, userId: req.userId })
  if(!deck) return res.status(404).json({ error: "not_found" })
  if(!req.file) return res.status(400).json({ error: "no_file" })
  parse(req.file.buffer, { columns: true, bom: true, skip_empty_lines: true, relax_column_count: true, trim: true }, async (err, records)=>{
    if(err) return res.status(400).json({ error: "parse_error", message: String(err.message || err) })
    const ops = []
    for(const r of records){
      const front = (r.front ?? "").toString().trim()
      const back = (r.back ?? "").toString().trim()
      if(!front || !back) continue
      const doc = {
        deckId: deck._id,
        front,
        back,
        ease: r.ease ? Number(r.ease) : 2.5,
        interval: r.interval ? Number(r.interval) : 0,
        dueAt: r.dueAt ? new Date(r.dueAt) : new Date(),
        streak: r.streak ? Number(r.streak) : 0
      }
      ops.push(doc)
    }
    if(ops.length) await Card.insertMany(ops)
    res.json({ inserted: ops.length })
  })
})

export default r
