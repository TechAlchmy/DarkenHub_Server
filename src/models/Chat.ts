import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends mongoose.Document {
  userId: string;
  message: string;
  timestamp: Date;
}

const messageSchema = new mongoose.Schema({
  userId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});;

export default mongoose.model<IMessage>('Message', messageSchema);