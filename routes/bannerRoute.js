import express from 'express';
import { addBanner, getBanner, editBanner } from '../controllers/bannerController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const bannerRouter = express.Router();

bannerRouter.post('/add', adminAuth, upload.array('images', 10), addBanner);
bannerRouter.get('/get', getBanner);
bannerRouter.put('/edit', adminAuth, upload.array('images', 10), editBanner);

export default bannerRouter;
