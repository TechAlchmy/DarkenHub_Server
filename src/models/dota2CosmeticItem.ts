import mongoose from "mongoose";
import { IItem, ItemModel, ItemSchema } from "./schemas/dota2CosmeticItemSchem";
// Define the user schema
export const Item = mongoose.model<IItem, ItemModel>("Item", ItemSchema);