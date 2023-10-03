const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv").config();
const { Op } = require("sequelize");
const Reservation = require("../models/Reservation");

router.get("/", async (req, res) => {
  const userAuth = { auth: false, reservations: [] };
  if (req.oidc.isAuthenticated()) {
    userAuth.auth = true;
    userAuth.id = req.oidc.user.sub;
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
