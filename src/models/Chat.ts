import mongoose, { Schema, Document } from 'mongoose';

interface ChatMessage {
  message: string;
  sender: string;
  timestamp: Date;
}

const ChatSchema: Schema = new Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<ChatMessage & Document>('Chat', ChatSchema);