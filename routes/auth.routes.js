const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { UserModel } = require("../models/user.model");
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/auth/signup", async (req, res) => {
    try {
        const isUser = await UserModel.findOne({ where: { email: req.body.email }});
        if (isUser)  return res.status(400).json({ message: "Users exists!"})
        const user = await UserModel.create({
            id: uuidv4(),
            username: req.body.username,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, bcryptjs.genSaltSync(10))
        });
        res.status(201).json({ message: "Users created!", user })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Create user Error" });
    }
});

router.post("/auth/signin", async (req, res) => {
    try {

        const { email, password } = req.body;

        const isUser = await UserModel.findOne({ where: { email } });

        if (!isUser) 
            return res.status(400).json({ message: "Users not exists!" })
        if (!bcryptjs.compareSync(password, isUser.password))
            return res.status(400).json({ message: "Incorrect password!" })

        // jwt
        // jwt_token_secret =  (.env) 
        const jwt_token_secret = "1234"
        const accessToken = jwt.sign({ email }, jwt_token_secret, { expiresIn: "1h" });

        res.status(200).json({ message: "Login ok!", accessToken })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login user Error" });
    }
});

router.get("/protected", authMiddleware, async (req, res) => {
    res.status(200).json({ message: "Has entrado en ruta privada! y tu email es: " + req.user.email })
});

module.exports = router;