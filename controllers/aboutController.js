import { v2 as cloudinary } from "cloudinary";
import aboutModel from "../models/aboutModel.js";

const uploadToCloudinary = (buffer) => new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) reject(error); else resolve(result.secure_url);
    }).end(buffer);
});

const addAbout = async (req, res) => {
    try {
        const { content } = req.body;
        if (!req.file || !content) return res.json({ success: false, message: "Image and content are required" });

        const image = await uploadToCloudinary(req.file.buffer);
        const about = new aboutModel({ image, content });
        await about.save();

        res.json({ success: true, message: "About us content added", data: about });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getAbout = async (req, res) => {
    try {
        const about = await aboutModel.findOne().sort({ createdAt: -1 });
        res.json({ success: true, data: about });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const editAbout = async (req, res) => {
    try {
        const { id, content } = req.body;
        if (!id) return res.json({ success: false, message: "ID is required" });

        const about = await aboutModel.findById(id);
        if (!about) return res.json({ success: false, message: "About us content not found" });

        if (req.file) about.image = await uploadToCloudinary(req.file.buffer);
        if (content) about.content = content;

        await about.save();
        res.json({ success: true, message: "About us content updated", data: about });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addAbout, getAbout, editAbout };
