import { Router } from "express"
import { requireAuth } from "../middleware/auth.js"
import ReviewLog from "../models/ReviewLog.js"

const r = Router()
r.use(requireAuth)

r.get("/review-activity", async (req,res)=>{
  const days = Number(req.query.days || 180)
  const since = new Date(Date.now() - days*24*60*60*1000)
  const rows = await ReviewLog.aggregate([
    { $match: { userId: (req.userId ? new (await import("mongoose")).default.Types.ObjectId(req.userId) : null), ts: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$ts" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ])
  res.json(rows)
})

export default r
