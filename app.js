const express = require("express");
const dotenv = require("dotenv").config();

const app = express();

const startServer = () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server Fired up on http://127.0.4.5:${process.env.PORT}`);
  });
};

startServer();
