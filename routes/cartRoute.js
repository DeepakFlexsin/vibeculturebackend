import express from 'express'
import { addToCart, getUserCart, updateCart, addDeliveryCharge, getAdminDeliveryCharges, getDeliveryCharges, deleteDeliveryCharge } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js';

const cartRouter = express.Router()

cartRouter.post('/get',authUser, getUserCart)
cartRouter.post('/add',authUser, addToCart)
cartRouter.post('/update',authUser, updateCart)
cartRouter.post('/adddeliverycharge',adminAuth, addDeliveryCharge)
cartRouter.get('/getadmindeliverycharges',adminAuth, getAdminDeliveryCharges)
cartRouter.post('/getdeliverycharges',authUser, getDeliveryCharges)
cartRouter.delete('/deletedeliverycharge/:id',adminAuth, deleteDeliveryCharge)

export default cartRouter