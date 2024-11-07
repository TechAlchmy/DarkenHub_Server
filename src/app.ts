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
import cron from 'node-cron';
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import dota2Routes from "./routes/dota2Routes";
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
app.use("/dota2", dota2Routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  // console.log('A user connected');

  // Join a specific room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    // console.log(`User joined room: ${roomId}`);

    // Send existing messages in the room to the new user
    Message.find({ roomId: roomId }).then((messages) => {
      socket.emit('chat history', messages);
    });
  });

  // Listen for incoming messages
  socket.on('chat message', (msg) => {
    const newMessage = new Message(msg);
    newMessage.save().then(() => {
      io.to(msg.roomId).emit('chat message', msg);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

cron.schedule('0 0 * * *', () => {
  Message.deleteMany({}, (err: any) => {
    if (err) console.error(err);
    else console.log('Chat history cleared');
  });
});

const port = process.env.PORT || 5500;
server.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
