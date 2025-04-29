import mongoose from 'mongoose';

export async function connectDB() {
  if (mongoose.connections[0].readyState) return; // ถ้าเชื่อมอยู่แล้วให้ข้าม

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
