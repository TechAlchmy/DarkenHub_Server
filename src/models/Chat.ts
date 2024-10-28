import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends mongoose.Document {
  roomId: string,
  userId: string;
  message: string;
  timestamp: Date;
}

const messageSchema = new mongoose.Schema({
  userId: String,
  message: String,
  roomId: String,
  timestamp: { type: Date, default: Date.now },
});;

export default mongoose.model<IMessage>('Message', messageSchema);