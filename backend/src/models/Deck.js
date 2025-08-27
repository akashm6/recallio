import mongoose from "mongoose"

const DeckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  title: String,
  tags: [String]
},{ timestamps: true })

export default mongoose.model("Deck", DeckSchema)
