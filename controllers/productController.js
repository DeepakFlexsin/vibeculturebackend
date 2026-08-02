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
        const site = 'https://www.vibeculture.in'

        const staticUrls = [
            { loc: `${site}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
            { loc: `${site}/collection`, priority: '0.9', changefreq: 'daily', lastmod: today },
            { loc: `${site}/about`, priority: '0.7', changefreq: 'monthly', lastmod: today },
            { loc: `${site}/contact`, priority: '0.6', changefreq: 'monthly', lastmod: today },
        ]

        const productUrls = products.map(p => {
            const d = new Date(p.date)
            const lastmod = isNaN(d.getTime()) ? today : d.toISOString().split('T')[0]
            return {
                loc: `${site}/product/` + (p.seo && p.seo.slug ? p.seo.slug : p._id),
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

const escapeHtml = (str = '') => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const findProductByIdOrSlug = async (idOrSlug) => {
    if (!idOrSlug) return null
    if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
        const byId = await productModel.findById(idOrSlug).populate('category').populate('subCategory').lean()
        if (byId) return byId
    }
    return productModel.findOne({ 'seo.slug': idOrSlug }).populate('category').populate('subCategory').lean()
}

// Open Graph HTML for WhatsApp / social crawlers (no JS required)
const getProductOg = async (req, res) => {
    try {
        const { idOrSlug } = req.params
        const product = await findProductByIdOrSlug(idOrSlug)

        if (!product) {
            return res.status(404).send('Product not found')
        }

        const site = 'https://www.vibeculture.in'
        const slug = product.seo?.slug || String(product._id)
        const url = `${site}/product/${slug}`
        const title = escapeHtml(product.seo?.metaTitle || product.name)
        const plainDesc = String(product.description || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
        const description = escapeHtml(product.seo?.metaDescription || plainDesc.slice(0, 160) || `Buy ${product.name} at VibeCulture`)
        const image = escapeHtml(product.seo?.ogImage || product.image?.[0] || `${site}/logo.png`)
        const price = product.price
        const inStock = Array.isArray(product.variants) && product.variants.length
            ? product.variants.some(v => v.quantity > 0)
            : true
        const categoryName = product.category?.name || ''
        const name = escapeHtml(product.name)

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | VibeCulture</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="VibeCulture" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="1200" />
  <meta property="og:image:alt" content="${name}" />
  <meta property="product:price:amount" content="${price}" />
  <meta property="product:price:currency" content="INR" />
  <meta property="product:availability" content="${inStock ? 'in stock' : 'out of stock'}" />
  <meta property="product:brand" content="VibeCulture" />
  ${categoryName ? `<meta property="product:category" content="${escapeHtml(categoryName)}" />` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body>
  <main style="font-family:system-ui,sans-serif;max-width:480px;margin:40px auto;padding:0 16px">
    <img src="${image}" alt="${name}" style="width:100%;border-radius:12px;aspect-ratio:1;object-fit:cover" />
    <h1 style="font-size:1.4rem;margin:16px 0 8px">${name}</h1>
    <p style="color:#555;margin:0 0 8px">${description}</p>
    <p style="font-size:1.25rem;font-weight:700;margin:0 0 16px">₹${price}</p>
    <a href="${url}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none">View on VibeCulture</a>
  </main>
</body>
</html>`

        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.setHeader('Cache-Control', 'public, max-age=600')
        res.send(html)
    } catch (error) {
        console.log(error)
        res.status(500).send('Error generating product preview')
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct, getProductsByCategory, getSitemap, getProductOg }