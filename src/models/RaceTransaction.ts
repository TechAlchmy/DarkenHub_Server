import mongoose from "mongoose";
import { IRaceTransaction, RaceTransactionSchema } from "./schemas/RaceTransactionSchema";
// Define the user schema
export const RaceTransaction = mongoose.models.IRaceTransaction || mongoose.model<IRaceTransaction>("RaceTransaction", RaceTransactionSchema);