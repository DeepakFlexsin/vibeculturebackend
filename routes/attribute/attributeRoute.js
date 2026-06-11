import express from 'express';
import { createAttribute, getAttributes, getAttributesBySubCategory, updateAttribute, deleteAttribute, addVariant, removeVariant } from '../../controllers/attribute/attributeController.js';

const attributeRouter = express.Router();

attributeRouter.post('/create', createAttribute);
attributeRouter.get('/list', getAttributes);
attributeRouter.get('/list/:subCategoryId', getAttributesBySubCategory);
attributeRouter.put('/update/:id', updateAttribute);
attributeRouter.delete('/delete/:id', deleteAttribute);
attributeRouter.post('/add-variant/:id', addVariant);
attributeRouter.delete('/remove-variant/:id/:variantId', removeVariant);

export default attributeRouter;
