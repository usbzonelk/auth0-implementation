const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv").config();
const { Op } = require("sequelize");
const Reservation = require("../models/Reservation");
const sanitizer = require("../utils/sanitize");
const validator = require("../utils/validator");

router.get("/", async (req, res) => {
  const userAuth = { auth: false };
  if (req.oidc.isAuthenticated()) {
    userAuth.auth = true;
    userAuth.id = req.oidc.user.sub;
    const options = {
      method: "GET",
      url: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userAuth.id}`,
      headers: { authorization: `Bearer ${process.env.AUTH0_MGMT}` },
    };

    await axios
      .request(options)
      .then(function (response) {
        userAuth.userDetails = response.data;
        res.render("reserve", { userAuth });
      })
      .catch(function (error) {
        res.redirect("/logout");
      });
  } else {
    res.redirect("/login");
  }
});

router.post("/", async (req, res) => {
  const userAuth = { auth: false };
  let userValidations = [];
  const reservationData = req.body;

  for (const key in reservationData) {
    reservationData[key] = sanitizer(reservationData[key]);
  }

  userValidations = validator(reservationData);

  if (req.oidc.isAuthenticated()) {
    userAuth.auth = true;
    userAuth.id = req.oidc.user.sub;

    const options = {
      method: "GET",
      url: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userAuth.id}`,
      headers: { authorization: `Bearer ${process.env.AUTH0_MGMT}` },
    };

    await axios
      .request(options)
      .then(function (response) {
        userAuth.userDetails = response.data;
      })
      .catch(function (error) {
        res.redirect("/logout");
      });

    try {
      console.log(userValidations);
      if (userValidations.length < 1) {
        reservationData.username = userAuth.userDetails.username;
        const newReservation = await Reservation.create(reservationData);
      }
      res.render("reserve", { userAuth, userValidations, reservationData });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.render("dbError");
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
