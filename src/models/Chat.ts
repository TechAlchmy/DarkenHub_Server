import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends mongoose.Document {
  chatType: string,
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

const messageSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  message: String,
  chatType: String,
  timestamp: { type: Date, default: Date.now },
});;

export default mongoose.model<IMessage>('Message', messageSchema);