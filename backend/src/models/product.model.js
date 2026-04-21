import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "JPY", "INR"],
        default: "INR",
      },
    },
    variants: [
      {
        attributes: {
          type: Map,
          of: String,
        },
        price: {
          amount: {
            type: Number,
          },
          currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "INR"],
            default: "INR",
          },
        },
        images: [
          {
            url: {
              type: String,
            },
          },
        ],
        stock: {
          type: Number,
          default: 0,
        },
      },
    ],
    images: [
      {
        url: {
          type: String,
        },
      },
    ],
    tags: {
      type: [String],
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
