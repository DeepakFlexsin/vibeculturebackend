import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import categoryRouter from './routes/category/categoryRoute.js'
import subCategoryRouter from './routes/category/subCategoryRoute.js'
import attributeRouter from './routes/attribute/attributeRoute.js'
import headerRouter from './routes/headerRoute.js'
import bannerRouter from './routes/bannerRoute.js'
import aboutRouter from './routes/aboutRoute.js'
import { getSitemap } from './controllers/productController.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors({ allowedHeaders: ['Content-Type', 'token', 'admintoken'] }))

// public sitemap route (no auth)
app.get('/sitemap.xml', getSitemap)

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/category',categoryRouter)
app.use('/api/subcategory',subCategoryRouter)
app.use('/api/attribute',attributeRouter)
app.use('/api/header',headerRouter)
app.use('/api/banner',bannerRouter)
app.use('/api/about',aboutRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})
 
app.listen(port, ()=> console.log('Server started on PORT : '+ port))