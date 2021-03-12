import express, { Request, Response } from "express";
import passport from "passport";
import users from "../models/users";

var router = express.Router();

export const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.user)
        return next();
    else
        return res.status(401).json({
            error: 'User not authenticated'
        });
}

router.post("/authenticate", (req, res) => {
    console.log(req.user);
    if (req.user) {
        res.json({
            id: req.user.id,
            username: req.user.username
        }).end();
    }
    else {
        res.json(null).end()
    }
})

router.post("/signup", (req, res) => {
    const { username, password } = req.body;
    users.findByUsername(username, (err: Error, user: Express.User) => {
        if (user) {
            console.log("User already exists.");
            return res.sendStatus(400).end();
        }
        else {
            users.createUser(username, password, (isSuccess: boolean) => {
                if (isSuccess) {
                    console.log(`New user created ${username}`);
                    return res.status(200).end();
                }
                res.sendStatus(400).end();
            });
        }
    });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
    console.log(`${req.user.username} has signed in.`);
    res.json({
        id: req.user.id,
        username: req.user.username
    }).end();
});

router.post("/signout", (req, res) => {
    req.logout();
    console.log("signed out");
    res.sendStatus(200).end();
});

export default router;
