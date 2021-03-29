"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../lib/db"));
const createUser = (username, password, cb) => {
    bcrypt_1.default.hash(password, 10, (err, hash) => {
        if (err) {
            return console.log(err);
        }
        db_1.default("users")
            .insert({ username, password: hash })
            .then(() => {
            cb(true);
        })
            .catch((err) => {
            console.log(err);
            cb(false);
        });
    });
};
const findById = (id, cb) => {
    process.nextTick(() => {
        db_1.default("users")
            .where("id", id)
            .first()
            .then((user) => {
            return cb(null, user);
        })
            .catch((err) => {
            return cb(err, null);
        });
    });
};
const findByUsername = (username, cb) => {
    process.nextTick(() => {
        return db_1.default("users")
            .where("username", username)
            .first()
            .then((user) => {
            return cb(null, user);
        })
            .catch((err) => {
            return cb(err, null);
        });
    });
};
exports.default = {
    createUser,
    findById,
    findByUsername,
};
