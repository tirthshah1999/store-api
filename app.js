require("dotenv").config();
require('express-async-errors');

const express = require("express");
const app = express();
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");

const router = require("./routes/products");

app.get("/", (req, res) => {
    res.send('<h1>Store API</h1> <a href="/api/v1/products">products route</a>');
})

app.use("/api/v1/products", router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
      // connectDB
      await connectDB(process.env.MONGO_URI);
      app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
    } catch (error) {
      console.log(error);
    }
  };
start();