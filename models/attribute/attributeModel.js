import mongoose from 'mongoose';

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subcategory',
    required: true
  },
  variants: [{
    value: {
      type: String,
      required: true,
      trim: true
    }
  }]
}, { timestamps: true });

const attributeModel = mongoose.models.attribute || mongoose.model('attribute', attributeSchema);

export default attributeModel;
