import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  available: { type: Boolean, default: true },
});

volunteerSchema.index({ location: '2dsphere' });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);
export default Volunteer;

// yehnchya madatene volunteer cha location track kela jato