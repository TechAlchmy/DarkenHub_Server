import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import { Server, Socket } from "socket.io"
dotenv.config();
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import dota2Routes from "./routes/dota2Routes";
import connectDB from "./config/db";

import socketHandler from './sockets/socket';

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

socketHandler(io);

// const port = process.env.PORT || 5500;
// server.listen(port, () => {
//   console.log(`server is running at http://localhost:${port}`);
// });


export default app
