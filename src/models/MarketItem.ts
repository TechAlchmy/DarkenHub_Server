import mongoose from "mongoose";
import { IMarketItems, MarketItemSchema } from "./schemas/MarketItemSchema";
// Define the user schema
export const MarketItems = mongoose.models.MarketItems || mongoose.model<IMarketItems>("MarketItems", MarketItemSchema);