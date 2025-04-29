import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  payor: { type: String, required: true },
  img: { type: String, required: true },
  pay: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  timestamp: { type: Number, default: () => Date.now() }
});


export default mongoose.models.Bill || mongoose.model('Bill', BillSchema);
