import mongoose, { Document, Model } from "mongoose";

// Define a new interface for the item methods if needed
interface IItemMethods {
  // Add any methods related to Item if necessary
}

// Extend the IItem interface to include the methods
export interface IItem extends Document, IItemMethods {
  itemName: string;
  rarity: string;    // e.g., 'common', 'rare', 'epic', 'legendary'
  quality: string;   // e.g., 'low', 'medium', 'high'
  type: string;      // e.g., 'weapon', 'armor', 'accessory'
  slot: string;      // e.g., 'weapon', 'armor', 'accessory'
  hero: string;      // reference to the hero associated with the item
}

// Create a new type that combines the model and methods
export type ItemModel = Model<IItem, {}, IItemMethods>;

export const ItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    rarity: { type: String, required: true },
    quality: { type: String, required: true },
    type: { type: String, required: true },
    slot: { type: String, required: true },
    hero: { type: String, required: true }, // You might want to use a reference to a Hero model
  },
  { timestamps: true }
);