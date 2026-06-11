import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const subCategoryModel = mongoose.models.subcategory || mongoose.model('subcategory', subCategorySchema);

export default subCategoryModel;
