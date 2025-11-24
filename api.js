const express = require("express");
const cors = require("cors");
const api = express();

const authRoutes = require("./routes/auth.routes");

api.use(cors());
api.use(express.json());
api.use("/api/v1/", authRoutes);

api.listen(3000, ()=> console.log("API running"));