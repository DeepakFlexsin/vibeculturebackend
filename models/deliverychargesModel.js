import mongoose from "mongoose";

const deliveryChargesSchema = new mongoose.Schema({
    minAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const deliveryChargesModel = mongoose.models.deliveryCharges || mongoose.model("deliveryCharges", deliveryChargesSchema);

export default deliveryChargesModel;
