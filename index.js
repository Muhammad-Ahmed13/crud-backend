const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const MONGOOSE_URL =
"mongodb+srv://ahmad:8wgkt8sGyNuyZ8Ki@cluster0.idonazb.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const authRouter = require("./router/auth");

// Middleware
app.use(cors());
app.use(express.json());
app.use(authRouter);

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGOOSE_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Start the server
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on port ${PORT}`)
);
