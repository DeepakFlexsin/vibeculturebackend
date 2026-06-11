import mongoose from "mongoose";

const headerSchema = new mongoose.Schema({
    logo: { type: String, required: true }
}, { timestamps: true });

const headerModel = mongoose.models.header || mongoose.model("header", headerSchema);

export default headerModel;
