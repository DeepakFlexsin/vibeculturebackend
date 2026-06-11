import attributeModel from '../../models/attribute/attributeModel.js';

// Create attribute
const createAttribute = async (req, res) => {
  try {
    const { name, subCategoryId, variants } = req.body;

    if (!name || !subCategoryId) {
      return res.json({ success: false, message: 'Name and subCategoryId are required' });
    }

    const attribute = new attributeModel({ name, subCategoryId, variants: variants || [] });
    await attribute.save();

    res.json({ success: true, message: 'Attribute created successfully', attribute });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all attributes
const getAttributes = async (req, res) => {
  try {
    const attributes = await attributeModel.find({}).populate('subCategoryId');
    res.json({ success: true, attributes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get attributes by subcategory
const getAttributesBySubCategory = async (req, res) => {
  try {
    const attributes = await attributeModel.find({ subCategoryId: req.params.subCategoryId });
    res.json({ success: true, attributes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update attribute
const updateAttribute = async (req, res) => {
  try {
    const { name, subCategoryId, variants } = req.body;
    await attributeModel.findByIdAndUpdate(req.params.id, { name, subCategoryId, variants });
    res.json({ success: true, message: 'Attribute updated successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete attribute
const deleteAttribute = async (req, res) => {
  try {
    await attributeModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Attribute deleted successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add variant to attribute
const addVariant = async (req, res) => {
  try {
    const { value } = req.body;
    const attribute = await attributeModel.findById(req.params.id);
    
    if (!attribute) {
      return res.json({ success: false, message: 'Attribute not found' });
    }

    attribute.variants.push({ value });
    await attribute.save();

    res.json({ success: true, message: 'Variant added successfully', attribute });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Remove variant from attribute
const removeVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const attribute = await attributeModel.findById(req.params.id);
    
    if (!attribute) {
      return res.json({ success: false, message: 'Attribute not found' });
    }

    attribute.variants = attribute.variants.filter(v => v._id.toString() !== variantId);
    await attribute.save();

    res.json({ success: true, message: 'Variant removed successfully', attribute });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { createAttribute, getAttributes, getAttributesBySubCategory, updateAttribute, deleteAttribute, addVariant, removeVariant };
