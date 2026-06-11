import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    images: [{ type: String, required: true }],
    headerText1: { type: String, default: "" },
    headerText2: { type: String, default: "" },
    headerText3: { type: String, default: "" }
}, { timestamps: true });

const bannerModel = mongoose.models.banner || mongoose.model("banner", bannerSchema);

export default bannerModel;
