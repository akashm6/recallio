import mongoose from "mongoose"

const CardSchema = new mongoose.Schema({
  deckId: { type: mongoose.Schema.Types.ObjectId, ref: "Deck", index: true },
  front: String,
  back: String,
  ease: { type: Number, default: 2.5 },
  interval: { type: Number, default: 0 },
  dueAt: { type: Date, default: () => new Date() },
  streak: { type: Number, default: 0 }
},{ timestamps: true })

export default mongoose.model("Card", CardSchema)
