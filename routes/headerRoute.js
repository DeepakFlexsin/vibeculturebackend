import express from 'express';
import { addHeaderLogo, getHeaderLogo, editHeaderLogo } from '../controllers/headerController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const headerRouter = express.Router();

headerRouter.post('/add', adminAuth, upload.single('logo'), addHeaderLogo);
headerRouter.get('/get', getHeaderLogo);
headerRouter.put('/edit', adminAuth, upload.single('logo'), editHeaderLogo);

export default headerRouter;
