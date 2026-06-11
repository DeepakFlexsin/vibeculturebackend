import express from 'express';
import { createCategory, getCategories, deleteCategory, updateCategory } from '../../controllers/category/categoryController.js';
import upload from '../../middleware/multer.js';
import adminAuth from '../../middleware/adminAuth.js';

const categoryRouter = express.Router();

categoryRouter.post('/create', adminAuth, upload.single('image'), createCategory);
categoryRouter.get('/list', getCategories);
categoryRouter.delete('/delete/:id', adminAuth, deleteCategory);
categoryRouter.put('/update/:id', adminAuth, upload.single('image'), updateCategory);

export default categoryRouter;
