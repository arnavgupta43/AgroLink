require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: {
    status: "Fail",
    msg: "Too many requests, please try again later.",
  },
});
app.use(limiter);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ErrorHandler);

module.exports = app;
