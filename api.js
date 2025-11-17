const express = require("express");
const api = express();

const authRoutes = require("./routes/auth.routes");

api.use(express.json());
api.use("/api/v1/", authRoutes);

api.listen(3000, ()=> console.log("API running"));