import mongoose, { Document, Model } from "mongoose";

// Define a new interface for the item methods if needed
interface ITransactionMethods {
  // Add any methods related to Item if necessary
}

// Extend the IItem interface to include the methods
export interface ITransaction extends Document, ITransactionMethods {
  item_id: string;
  seller: string;
  buyer: string;
  item: Object;
  price: number;
  tradeLink: string;
  status: number;
}

// Create a new type that combines the model and methods
export type ITransactionModel = Model<ITransaction, {}, ITransactionMethods>;

export const TransactionSchema = new mongoose.Schema(
  {
    item_id: { type: String, required: true },
    seller: { type: String, required: true },
    buyer: { type: String, required: true },
    item: { type: Object, required: true },
    price: { type: String, required: true },
    tradeLink: { type: String, required: true },
    status: { type: Number, required: true },
  },
  { timestamps: true }
);