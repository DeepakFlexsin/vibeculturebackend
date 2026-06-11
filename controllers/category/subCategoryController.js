import subCategoryModel from '../../models/category/subCategoryModel.js';

// Create subcategory
const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId, description } = req.body;

    if (!name || !categoryId) {
      return res.json({ success: false, message: 'Name and categoryId are required' });
    }

    const subCategory = new subCategoryModel({ name, categoryId, description });
    await subCategory.save();

    res.json({ success: true, message: 'SubCategory created successfully', subCategory });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all subcategories
const getSubCategories = async (req, res) => {
  try {
    const subCategories = await subCategoryModel.find({}).populate('categoryId');
    res.json({ success: true, subCategories });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get subcategories by category
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await subCategoryModel.find({ categoryId: req.params.categoryId });
    res.json({ success: true, subCategories });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete subcategory
const deleteSubCategory = async (req, res) => {
  try {
    await subCategoryModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'SubCategory deleted successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update subcategory
const updateSubCategory = async (req, res) => {
  try {
    const { name, categoryId, description } = req.body;
    await subCategoryModel.findByIdAndUpdate(req.params.id, { name, categoryId, description });
    res.json({ success: true, message: 'SubCategory updated successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { createSubCategory, getSubCategories, getSubCategoriesByCategory, deleteSubCategory, updateSubCategory };
