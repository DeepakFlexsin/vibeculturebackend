import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    image: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

const aboutModel = mongoose.models.about || mongoose.model("about", aboutSchema);

export default aboutModel;