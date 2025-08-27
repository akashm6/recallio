import { Router } from "express"
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const r = Router()

r.post("/register", async (req,res)=>{
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) })
  const data = schema.parse(req.body)
  const existing = await User.findOne({ email: data.email })
  if(existing) return res.status(409).json({ error: "exists" })
  const passwordHash = await bcrypt.hash(data.password, 10)
  const user = await User.create({ email: data.email, passwordHash })
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" })
  res.json({ token })
})

r.post("/login", async (req,res)=>{
  const schema = z.object({ email: z.string().email(), password: z.string() })
  const data = schema.parse(req.body)
  const user = await User.findOne({ email: data.email })
  if(!user) return res.status(401).json({ error: "invalid" })
  const ok = await bcrypt.compare(data.password, user.passwordHash)
  if(!ok) return res.status(401).json({ error: "invalid" })
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" })
  res.json({ token })
})

export default r
