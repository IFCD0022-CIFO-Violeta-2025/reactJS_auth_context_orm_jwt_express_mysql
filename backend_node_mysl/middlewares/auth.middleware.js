const jwt = require("jsonwebtoken");
const jwt_token_secret = "1234"

const authMiddleware = (req, res, next) => {
    const accessToken = req.headers.authorization;
    if (!accessToken || !accessToken.startsWith("Bearer ")) {
        res.status(403).json({ message: "Incorrect Token! "})
    }
    try {
        req.user = jwt.verify(accessToken.split(" ")[1], jwt_token_secret)
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized!" });
    }
}

module.exports = authMiddleware;