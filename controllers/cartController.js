import userModel from "../models/userModel.js"
import DeliveryChargesModel from "../models/deliverychargesModel.js"


// add products to user cart
const addToCart = async (req,res) => {
    try {
        
        const { userId, itemId, size } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        
        const { userId ,itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const addDeliveryCharge = async (req, res) => {
  try {
    const { minAmount, deliveryCharge } = req.body;

    const data = await DeliveryChargesModel.create({
      minAmount,
      deliveryCharge,
    });

    res.json({
      success: true,
      message: "Delivery charge added",
      data,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAdminDeliveryCharges = async (req, res) => {
  try {

    const deliveryCharges = await DeliveryChargesModel
      .find({})
      .sort({ minAmount: 1 });

    res.json({
      success: true,
      count: deliveryCharges.length,
      deliveryCharges,
    });

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getDeliveryCharges = async (req, res) => {
  try {
    const { cartAmount } = req.body;

    const rule = await DeliveryChargesModel
      .findOne({ minAmount: { $gte: cartAmount } })
      .sort({ minAmount: -1 });

    const deliveryCharge = rule ? rule.deliveryCharge : 0;

    res.json({
      success: true,
      cartAmount,
      deliveryCharge,
      totalAmount: cartAmount + deliveryCharge,
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const deleteDeliveryCharge = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await DeliveryChargesModel.findByIdAndDelete(id);

    if (!result) {
      return res.json({
        success: false,
        message: 'Delivery charge not found',
      });
    }

    res.json({
      success: true,
      message: 'Delivery charge deleted successfully',
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, addDeliveryCharge, getAdminDeliveryCharges, getDeliveryCharges, deleteDeliveryCharge }