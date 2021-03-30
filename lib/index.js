"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const colyseus_1 = require("colyseus");
const monitor_1 = require("@colyseus/monitor");
const users_1 = __importDefault(require("./models/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const DrawingRoom_1 = require("./rooms/DrawingRoom");
passport_1.default.use(new passport_local_1.Strategy((username, password, cb) => {
    users_1.default.findByUsername(username, (err, user) => {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false);
        }
        bcrypt_1.default.compare(password, user.password).then((pass) => {
            return pass ? cb(null, user) : cb(null, false);
        });
    });
}));
passport_1.default.serializeUser((user, cb) => {
    cb(null, {
        id: user.id,
        username: user.username
    });
});
passport_1.default.deserializeUser((user, cb) => {
    users_1.default.findById(user.id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});
const port = Number(process.env.PORT || 2567);
const app = express_1.default();
const sessionParser = express_session_1.default({
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: false
    },
    resave: false,
    saveUninitialized: false,
});
app.use(cors_1.default({
    origin: true,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(sessionParser);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/", auth_1.default);
// for deployment
app.use(express_1.default.static(path_1.default.join(__dirname, '/../client/build')));
app.get("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/../client/build/index.html'));
});
const server = http_1.default.createServer(app);
const gameServer = new colyseus_1.Server({
    server,
    verifyClient: (info, next) => {
        // Make "session" available for the WebSocket connection (during onAuth())
        sessionParser(info.req, {}, () => next(true));
    }
});
// register your room handlers
gameServer.define("drawingRoom", DrawingRoom_1.DrawingRoom);
// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor_1.monitor());
gameServer.onShutdown(() => {
    console.log("Game server is shutting down.");
});
gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
