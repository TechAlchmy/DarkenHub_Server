import mongoose, { Document, Model } from "mongoose";

// Define a new interface for the item methods if needed
interface IMarketItemsMethods {
  // Add any methods related to Item if necessary
}

// Extend the IMarketItems interface to include the methods
export interface IMarketItems extends Document, IMarketItemsMethods {
  item_id: string;
  seller: string;
  item: Object;
  price: number;
}

// Create a new type that combines the model and methods
export type MarketItemModel = Model<IMarketItems, {}, IMarketItemsMethods>;

export const MarketItemSchema = new mongoose.Schema(
  {
    item_id: { type: String, required: true },
    seller: { type: String, required: true },
    item: { type: Object, required: true },
    price: { type: String, required: true },
  },
  { timestamps: true }
);