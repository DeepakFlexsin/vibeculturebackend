import { v2 as cloudinary } from "cloudinary";
import bannerModel from "../models/bannerModel.js";

const uploadToCloudinary = (buffer) => new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) reject(error); else resolve(result.secure_url);
    }).end(buffer);
});

const addBanner = async (req, res) => {
    try {
        const { headerText1, headerText2, headerText3 } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: "At least one image is required" });
        }

        const images = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));

        const banner = new bannerModel({
            images,
            headerText1: headerText1 || "",
            headerText2: headerText2 || "",
            headerText3: headerText3 || ""
        });
        await banner.save();

        res.json({ success: true, message: "Banner added", data: banner });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getBanner = async (req, res) => {
    try {
        const banner = await bannerModel.findOne().sort({ createdAt: -1 });
        res.json({ success: true, data: banner });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const editBanner = async (req, res) => {
    try {
        const { id, headerText1, headerText2, headerText3 } = req.body;
        if (!id) return res.json({ success: false, message: "ID is required" });

        const banner = await bannerModel.findById(id);
        if (!banner) return res.json({ success: false, message: "Banner not found" });

        if (req.files && req.files.length > 0) {
            banner.images = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));
        }

        if (headerText1 !== undefined) banner.headerText1 = headerText1;
        if (headerText2 !== undefined) banner.headerText2 = headerText2;
        if (headerText3 !== undefined) banner.headerText3 = headerText3;

        await banner.save();
        res.json({ success: true, message: "Banner updated", data: banner });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addBanner, getBanner, editBanner };
