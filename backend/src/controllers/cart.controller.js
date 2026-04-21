import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const stock = await stockOfVariant(productId, variantId);

  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user._id }));

  const isProductAlreadyInCart = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId,
  );

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    ).quantity;
    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
        success: false,
      });
    }

    await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId,
      },
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );

    return res.status(200).json({
      message: "Cart updated successfully",
      success: true,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock`,
      success: false,
    });
  }

  cart.items.push({
    product: productId,
    variant: variantId,
    quantity,
    price: product.price,
  });

  await cart.save();

  return res.status(200).json({
    message: "Product added to cart successfully",
    success: true,
  });
};

export const getCart = async (req, res) => {
  const user = req.user;

  let cart = await cartModel
    .findOne({ user: user._id })
    .populate("items.product");

  if (!cart) {
    cart = await cartModel.create({ user: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

export const calculateCartTotal = (cart) => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      subtotal: 0,
      total: 0,
      itemCount: 0,
      currency: "INR",
    };
  }

  const currency = cart.items[0]?.price?.currency || "INR";

  const subtotal = cart.items.reduce((sum, item) => {
    const product = productModel.findById(item.productId);
    const itemPrice = product.price?.amount || 0;
    const itemQuantity = item.quantity || 0;
    return sum + itemPrice * itemQuantity;
  }, 0);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    total: Number(subtotal.toFixed(2)),
    itemCount: cart.items.length,
    currency,
  };
};

export const removeFromCart = async (req, res) => {
  const user = req.user;
  let cart = await cartModel
    .findOne({ user: user._id })
    .populate("items.product");

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const { productId, variantId } = req.params;

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product._id.toString() === productId &&
      item.variant?.toString() === variantId,
  );
  if (itemIndex === -1) {
    return res.status(404).json({
      message: "Product not found in cart",
      success: false,
    });
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  return res.status(200).json({
    message: "Product removed from cart successfully",
    success: true,
  });
};

export const increaseCartItemQuantity = async (req, res) => {
  const user = req.user;
  let cart = await cartModel
    .findOne({ user: user._id })
    .populate("items.product");
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }
  const { productId, variantId } = req.params;

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product._id.toString() === productId &&
      item.variant?.toString() === variantId,
  );
  if (itemIndex === -1) {
    return res.status(404).json({
      message: "Product not found in cart",
      success: false,
    });
  }
  cart.items[itemIndex].quantity += 1;
  await cart.save();
  return res.status(200).json({
    message: "Cart item quantity increased successfully",
    success: true,
    cart,
  });
};
export const decreaseCartItemQuantity = async (req, res) => {
  const user = req.user;
  let cart = await cartModel
    .findOne({ user: user._id })
    .populate("items.product");
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }
  const { productId, variantId } = req.params;

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product._id.toString() === productId &&
      item.variant?.toString() === variantId,
  );
  if (itemIndex === -1) {
    return res.status(404).json({
      message: "Product not found in cart",
      success: false,
    });
  }
  if (cart.items[itemIndex].quantity <= 1) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity -= 1;
  }
  await cart.save();
  return res.status(200).json({
    message: "Cart item quantity decreased successfully",
    success: true,
    cart,
  });
};
