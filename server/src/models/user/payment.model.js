import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    enum: ["cash", "upi"],
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "pending", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
