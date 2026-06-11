import { v2 as cloudinary } from "cloudinary";
import headerModel from "../models/headerModel.js";

const uploadToCloudinary = (buffer) => new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) reject(error); else resolve(result.secure_url);
    }).end(buffer);
});

const addHeaderLogo = async (req, res) => {
    try {
        if (!req.file) return res.json({ success: false, message: "Image is required" });

        const logo = await uploadToCloudinary(req.file.buffer);
        const header = new headerModel({ logo });
        await header.save();

        res.json({ success: true, message: "Header logo added", data: header });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getHeaderLogo = async (req, res) => {
    try {
        const header = await headerModel.findOne().sort({ createdAt: -1 });
        res.json({ success: true, data: header });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const editHeaderLogo = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.json({ success: false, message: "ID is required" });

        const header = await headerModel.findById(id);
        if (!header) return res.json({ success: false, message: "Header not found" });

        if (req.file) {
            header.logo = await uploadToCloudinary(req.file.buffer);
        }

        await header.save();
        res.json({ success: true, message: "Header logo updated", data: header });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addHeaderLogo, getHeaderLogo, editHeaderLogo };
