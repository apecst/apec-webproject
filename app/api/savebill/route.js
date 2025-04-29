import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { payor, total, img } = body;

    // ตรวจสอบว่าข้อมูลที่ต้องใช้มีครบ
    if (!payor || !img || !total) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields (payor, img, total)",
      });
    }

    const newBill = new Bill({
      payor,
      pay: total,
      img,
    });

    await newBill.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MongoDB Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
