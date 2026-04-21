import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  const { title, description, priceAmount, priceCurrency, stock, variants , tags } = req.body;
  const seller = req.user;
  console.log(seller);

  try {
    // Parse variants if it's a string (from FormData)
    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    // Process variant images
    for (let i = 0; i < parsedVariants.length; i++) {
      const variantImages = req.files.filter((file) =>
        file.fieldname.startsWith(`variant-${i}-images`)
      );

      const uploadedImages = await Promise.all(
        variantImages.map(async (file) => {
          return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
            folder: "snitch",
          });
        })
      );

      parsedVariants[i].images = uploadedImages;
    }

    const product = await productModel.create({
      title,
      description,
      seller: seller.id,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      images: [],
      stock: stock || 0,
      tags: tags || [],
      variants: parsedVariants,
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Error creating product:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create product" });
  }
};

export const getSellerProducts = async (req, res) => {
  const seller = req.user;
  try {
    const products = await productModel.find({ seller: seller.id });
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

export const getProductDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }
    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("Error fetching product details:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product details" });
  }
};

export async function addProductVariant(req, res) {
  const productId = req.params.productId;

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  const files = req.files;
  const images = [];
  if (files || files.length !== 0) {
    (
      await Promise.all(
        files.map(async (file) => {
          const image = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
          return image;
        }),
      )
    ).map((image) => images.push(image));
  }

  const price = req.body.priceAmount;
  const stock = req.body.stock;
  const attributes = JSON.parse(req.body.attributes || "{}");

  console.log(price);

  product.variants.push({
    images,
    price: {
      amount: Number(price) || product.price.amount,
      currency: req.body.priceCurrency || product.price.currency,
    },
    stock,
    attributes,
  });

  await product.save();

  return res.status(200).json({
    message: "Product variant added successfully",
    success: true,
    product,
  });
}
export const searchProducts = async (req, res) => {
  const { query } = req.query;
  try {
    const products = await productModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error searching products:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to search products" });
  }
};


export const getSimilarProducts = async (req, res) => {
  try {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }
  const similarProducts = await productModel.find({
    tags: { $in: product.tags },
    _id: { $ne: productId },
  }).limit(4);
  return res.status(200).json({ success: true, similarProducts });
  } 
  catch (err) {
    console.error("Error fetching similar products:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch similar products" });
  }
  
}