import mongoose from "mongoose";


const disasterSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  radius: { type: Number, required: true },
  resources: {
    food: { type: Number, default: 0 },
    medikits: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    blankets: { type: Number, default: 0 },
    // add kara kar jar jaste kahi takeych asel tar 
  },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});
// ithe jare 3d lashift hoche asel tar
disasterSchema.index({ location: '2dsphere' }); 

const Disaster = mongoose.model('Disaster', disasterSchema);
export default Disaster;
