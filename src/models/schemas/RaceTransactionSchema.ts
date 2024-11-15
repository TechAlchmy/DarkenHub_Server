import mongoose, { Document, Model } from "mongoose";

// Define a new interface for the item methods if needed
interface IRaceTransactionMethods {
  // Add any methods related to Item if necessary
}
interface IBuyer {
  buyer: string;
  bidPrice: string;
  date: Date;
  tradeLink: string;
}
// Extend the IItem interface to include the methods
export interface IRaceTransaction extends Document, IRaceTransactionMethods {
  item_id: string;
  seller: string;
  buyer: IBuyer[];
  item: Object;
  price: number;
  status: number;
}

// Create a new type that combines the model and methods
export type IRaceTransactionModel = Model<IRaceTransaction, {}, IRaceTransactionMethods>;

export const RaceTransactionSchema = new mongoose.Schema(
  {
    item_id: { type: String, required: true },
    seller: { type: String, required: true },
    buyer: { type: Array, required: false },
    item: { type: Object, required: true },
    price: { type: String, required: false },
    status: { type: Number, required: true },
  },
  { timestamps: true }
);