import mongoose from "mongoose"

const SettingsSchema = new mongoose.Schema({
  dailyGoal: { type: Number, default: 50 }
},{ _id:false })

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: String,
  settings: { type: SettingsSchema, default: {} }
},{ timestamps: true })

export default mongoose.model("User", UserSchema)
