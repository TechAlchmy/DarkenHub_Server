import mongoose from "mongoose";
import { IRaceItems, RaceItemSchema } from "./schemas/RaceItemSchema";
// Define the user schema
export const RaceItems = mongoose.models.RaceItems || mongoose.model<IRaceItems>("RaceItems", RaceItemSchema);