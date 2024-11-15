import mongoose from "mongoose";
import { ITransaction, TransactionSchema } from "./schemas/TransactionSchema";
// Define the user schema
export const Transaction = mongoose.models.ITransaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);