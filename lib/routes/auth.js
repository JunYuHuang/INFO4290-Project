"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const users_1 = __importDefault(require("../models/users"));
var router = express_1.default.Router();
const isAuthenticated = (req, res, next) => {
    if (req.user)
        return next();
    else
        return res.status(401).json({
            error: 'User not authenticated'
        });
};
exports.isAuthenticated = isAuthenticated;
router.post("/authenticate", (req, res) => {
    if (req.user) {
        res.json({
            id: req.user.id,
            username: req.user.username
        }).end();
    }
    else {
        res.json(null).end();
    }
});
router.post("/signup", (req, res) => {
    const { username, password } = req.body;
    users_1.default.findByUsername(username, (err, user) => {
        if (user) {
            console.log("User already exists.");
            return res.sendStatus(400).end();
        }
        else {
            users_1.default.createUser(username, password, (isSuccess) => {
                if (isSuccess) {
                    console.log(`New user created ${username}`);
                    return res.status(200).end();
                }
                res.sendStatus(400).end();
            });
        }
    });
});
router.post("/login", passport_1.default.authenticate("local"), (req, res) => {
    console.log(`${req.user.username} has signed in.`);
    res.json({
        id: req.user.id,
        username: req.user.username
    }).end();
});
router.post("/signout", (req, res) => {
    console.log(`${req.user.username} has signed out.`);
    req.logout();
    res.sendStatus(200).end();
});
exports.default = router;
