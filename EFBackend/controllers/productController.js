const Product = require("../models/product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, owner } = req.body;

    // Default image path on your server (modify this as needed)
    const defaultImagePath = "/uploads/default-image.jpg";

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      owner,
      imageUrl: req.body.imageUrl || defaultImagePath,
      // Use the provided imageUrl or the defaultImagePath
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Retrieve a list of all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Retrieve all products owned by a specific user
exports.getProductsByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    // Find all products with the specified ownerId
    const products = await Product.find({ owner: ownerId });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Retrieve a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Update a product by ID
exports.partialUpdateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, description, price, category, imageUrl } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id; // Get the user ID from the authenticated user

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is the owner of the product
    if (product.owner.toString() !== userId) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Update only the provided fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by ID ( with ownership check )
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id; // Get the user ID from the authenticated user

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is the owner of the product
    if (product.owner.toString() !== userId) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Proceed with deleting the product
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
