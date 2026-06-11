import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, variants, seo, imageUrls } = req.body

        // Validate price
        if (!price || isNaN(Number(price)) || Number(price) < 0) {
            return res.json({ success: false, message: "Invalid price value" })
        }

        const imagesUrl = imageUrls ? JSON.parse(imageUrls) : []

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            variants: variants ? JSON.parse(variants) : [],
            image: imagesUrl,
            date: Date.now(),
            seo: seo ? JSON.parse(seo) : {}
        }

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({}).populate('category').populate('subCategory');
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId).populate('category').populate('subCategory')
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params
        const products = await productModel.find({ category: categoryId }).populate('category').populate('subCategory')
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for update product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, bestseller, variants, seo, imageUrls } = req.body

        // Validate price
        if (!price || isNaN(Number(price)) || Number(price) < 0) {
            return res.json({ success: false, message: "Invalid price value" })
        }

        let updateData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            variants: variants ? JSON.parse(variants) : [],
            seo: seo ? JSON.parse(seo) : {}
        }

        if (imageUrls) {
            updateData.image = JSON.parse(imageUrls)
        }

        await productModel.findByIdAndUpdate(id, updateData)

        res.json({ success: true, message: "Product Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getSitemap = async (req, res) => {
    try {
        const products = await productModel.find({}, '_id name seo date').lean()

        const today = new Date().toISOString().split('T')[0]

        const staticUrls = [
            { loc: 'https://www.krivante.store/', priority: '1.0', changefreq: 'daily', lastmod: today },
            { loc: 'https://www.krivante.store/collection', priority: '0.9', changefreq: 'daily', lastmod: today },
            { loc: 'https://www.krivante.store/about', priority: '0.7', changefreq: 'monthly', lastmod: today },
            { loc: 'https://www.krivante.store/contact', priority: '0.6', changefreq: 'monthly', lastmod: today },
        ]

        const productUrls = products.map(p => {
            const d = new Date(p.date)
            const lastmod = isNaN(d.getTime()) ? today : d.toISOString().split('T')[0]
            return {
                loc: 'https://www.krivante.store/product/' + (p.seo && p.seo.slug ? p.seo.slug : p._id),
                priority: '0.9',
                changefreq: 'weekly',
                lastmod
            }
        })

        const allUrls = [...staticUrls, ...productUrls]

        const urlTags = allUrls.map(u =>
            '<url>' +
            '<loc>' + u.loc + '</loc>' +
            '<lastmod>' + u.lastmod + '</lastmod>' +
            '<changefreq>' + u.changefreq + '</changefreq>' +
            '<priority>' + u.priority + '</priority>' +
            '</url>'
        ).join('')

        const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urlTags + '</urlset>'

        res.setHeader('Content-Type', 'application/xml')
        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.send(xml)
    } catch (error) {
        console.log(error)
        res.status(500).send('Error generating sitemap')
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct, getProductsByCategory, getSitemap }