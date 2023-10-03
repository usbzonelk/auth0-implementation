const express = require("express");
const dotenv = require("dotenv").config();
const path = require('path');
const { auth } = require('express-openid-connect');

const dbConnection = require("./config/DBConnection").dbConnection;

const app = express();

// Added static folder for static stuff
app.use(express.static(path.join(__dirname, 'static')));

// Set up EJS for views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Added auth0 config
app.use(
  auth({
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.SESSION_SECRET,
    authRequired: false,
    auth0Logout: true,
  }),
);

const startServer = async () => {
   dbConnection
    .sync()
    .then(() => {
      app.listen(process.env.PORT, () => {
        console.log(`Server Fired up on http://127.0.4.5:${process.env.PORT}`);
      });
    })
    .catch((err) => {
      console.error("Error syncing Sequelize:", err);
    });
};

startServer();
