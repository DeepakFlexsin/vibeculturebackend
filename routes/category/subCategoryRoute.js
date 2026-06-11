import express from 'express';
import { createSubCategory, getSubCategories, getSubCategoriesByCategory, deleteSubCategory, updateSubCategory } from '../../controllers/category/subCategoryController.js';

const subCategoryRouter = express.Router();

subCategoryRouter.post('/create', createSubCategory);
subCategoryRouter.get('/list', getSubCategories);
subCategoryRouter.get('/list/:categoryId', getSubCategoriesByCategory);
subCategoryRouter.delete('/delete/:id', deleteSubCategory);
subCategoryRouter.put('/update/:id', updateSubCategory);

export default subCategoryRouter;
