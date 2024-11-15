import mongoose, { Document, Model } from "mongoose";

// Define a new interface for the item methods if needed
interface IRaceItemsMethods {
  // Add any methods related to Item if necessary
}

interface IItem {
  itemName: string;
  iconUrl: string;
  quality: string;
  rarity: string;
  type: string;
  hero: string;
}

// Define the main RaceItem interface
export interface IRaceItems extends Document {
  item_id: string;
  seller: string;
  item: IItem;
  price: number;
  status: number;
  startDate: Date;
}

// Create a new type that combines the model and methods
export type RaceItemModel = Model<IRaceItems, {}, IRaceItemsMethods>;

export const RaceItemSchema = new mongoose.Schema(
  {
    item_id: { type: String, required: true },
    seller: { type: String, required: true },
    item: { type: Object, required: true },
    price: { type: String, required: true },
    status: { type: Number, required: true },
    startDate: { type: Date, required: true },
  },
  { timestamps: true }
);