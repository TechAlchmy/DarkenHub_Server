import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import { Server, Socket } from "socket.io"
import Message from "./models/Chat"
import { ChatMessage } from "types/ChatMessage";
dotenv.config();

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/db";
import "./config/passport";

connectDB();

// intilizing express
const app = express();

// Middleware
// Initialize session middleware
app.use(
  session({
    secret: "some_secret", // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// // Listen for incoming connections
// io.on('connection', (socket: Socket) => {
//   console.log('A user connected:', socket.id);

//   // Send chat history when a new user connects
//   Chat.find().sort({ timestamp: 1 }).then(messages => {
//     socket.emit('chatHistory', messages);
//   });

//   // Listen for chat messages
//   socket.on('chatMessage', (message: string) => {
//     console.log('enter');
//     const newMessage: ChatMessage = {
//       message,
//       sender: socket.id, // You can use a user ID or username instead of socket.id
//       timestamp: new Date(),
//     };

//     const chat = new Chat(newMessage);

//     chat.save()
//       .then(() => {
//         // Broadcast message to all connected clients
//         io.emit('chatMessage', newMessage);
//       })
//       .catch(err => console.error('Error saving message:', err));
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// Handle Socket Connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing messages to the new user
  Message.find().then((messages) => {
    socket.emit('chat history', messages);
  });

  // Listen for incoming messages
  socket.on('chat message', (msg: any) => {
    const newMessage = new Message(msg);
    newMessage.save().then(() => {
      io.emit('chat message', msg);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 5500;
server.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
