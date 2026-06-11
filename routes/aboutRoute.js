import express from 'express';
import { addAbout, getAbout, editAbout } from '../controllers/aboutController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const aboutRouter = express.Router();

aboutRouter.post('/add', adminAuth, upload.single('image'), addAbout);
aboutRouter.get('/get', getAbout);
aboutRouter.post('/edit', adminAuth, upload.single('image'), editAbout);

export default aboutRouter;