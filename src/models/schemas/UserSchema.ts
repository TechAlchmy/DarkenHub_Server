import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require('dotenv').config();

// Define a new interface for the methods
interface IUserMethods {
  comparePassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
} 

// Extend the IUser interface to include the methods
export interface IUser extends Document, IUserMethods {
  fullname: string;
  userID: string;
  email: string;
  password?: string;
  googleId?: string;
  steamId?: string;
}

// Create a new type that combines the model and methods
export type UserModel = Model<IUser, {}, IUserMethods>;

export const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    userID: {type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    googleId: { type: String, sparse: true, unique: true },
    steamId: { type: String, sparse: true, unique: true },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
