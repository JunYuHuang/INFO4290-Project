import bcrypt from "bcrypt";
import db from "../lib/db";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      password: string;
    }
  }
}

const createUser = (username: string, password: string, cb: Function) => {
  bcrypt.hash(password, 10, (err: any, hash: any) => {
    if (err) {
      return console.log(err);
    }
    db("users")
      .insert({ username, password: hash })
      .then(() => {
        cb(true);
      })
      .catch((err: any) => {
        console.log(err);
        cb(false);
      });
  });
};

const findById = (id: number, cb: Function) => {
  process.nextTick(() => {
    db<Express.User>("users")
      .where("id", id)
      .first()
      .then((user: any) => {
        return cb(null, user);
      })
      .catch((err: any) => {
        return cb(err, null);
      });
  });
};

const findByUsername = (username: string, cb: Function) => {
  process.nextTick(() => {
    return db<Express.User>("users")
      .where("username", username)
      .first()
      .then((user: any) => {
        return cb(null, user);
      })
      .catch((err: any) => {
        return cb(err, null);
      });
  });
};

export default {
  createUser,
  findById,
  findByUsername,
};
