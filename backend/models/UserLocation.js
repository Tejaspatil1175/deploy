import mongoose from "mongoose";

const userLocationSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});

userLocationSchema.index({ location: "2dsphere" });
// ithe data frontend mhadun call hoto
export default mongoose.model("UserLocation", userLocationSchema);
