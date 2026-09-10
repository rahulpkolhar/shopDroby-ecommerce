const Product = require('../model/product');
const cloudinary = require('../config/cloudinary');
const { isCloudinaryConfigured } = cloudinary;

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Name, description, price, category, and stock are required' });
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ message: 'Price and stock must be valid non-negative numbers' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    if (!isCloudinaryConfigured) {
      console.error('Product creation failed: Cloudinary environment variables are missing');
      return res.status(500).json({ message: 'Image service is not configured' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    if (!result.secure_url) {
      console.error('Product creation failed: Cloudinary did not return secure_url');
      return res.status(502).json({ message: 'Image upload failed' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl: result.secure_url,
      seller: req.user._id
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Product creation failed:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      if (req.user.role === 'seller' && String(product.seller) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Seller access required' });
      }

      product.name = name !== undefined ? name : product.name;
      product.description = description !== undefined ? description : product.description;
      product.price = price !== undefined ? price : product.price;
      product.category = category !== undefined ? category : product.category;
      product.stock = stock !== undefined ? stock : product.stock;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        product.imageUrl = result.secure_url;
      }
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Product update failed:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (req.user.role === 'seller' && String(product.seller) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Seller access required' });
      }

      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Product deletion failed:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, getMyProducts, createProduct, updateProduct, deleteProduct };