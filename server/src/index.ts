require("dotenv").config();
import http from "http";
import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";

import users from "./models/users";
import auth from "./routes/auth";
import { DrawingRoom } from "./rooms/DrawingRoom";

passport.use(
  new LocalStrategy((username, password, cb) => {
    users.findByUsername(username, (err: Error, user: Express.User) => {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      bcrypt.compare(password, user.password).then((pass) => {
        return pass ? cb(null, user) : cb(null, false);
      });
    });
  })
);

passport.serializeUser((user, cb) => {
  cb(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user: any, cb) => {
  users.findById(user.id, (err: Error, user: Express.User) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

const port = Number(process.env.PORT || 2567);
const app = express();

const sessionParser = session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: false
  },
  resave: false,
  saveUninitialized: false,
})

app.use(cors({
  origin: true,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionParser);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", auth);

const server = http.createServer(app);
const gameServer = new Server({
  server,
  verifyClient: (info, next) => {
    // Make "session" available for the WebSocket connection (during onAuth())
    sessionParser(info.req as any, {} as any, () => next(true));
  }
});

// register your room handlers
gameServer.define("drawingRoom", DrawingRoom);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

gameServer.onShutdown(() => {
  console.log("Game server is shutting down.");
});

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
