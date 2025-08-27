import mongoose from "mongoose"

const ReviewLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  deckId: { type: mongoose.Schema.Types.ObjectId, ref: "Deck", index: true },
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card", index: true },
  grade: Number,
  ts: { type: Date, default: () => new Date(), index: true }
})

export default mongoose.model("ReviewLog", ReviewLogSchema)
