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
  } else {
    res.redirect("/login");
    return;
  }

  try {
    const reservations = await Reservation.findAll({
      where: {
        username: {
          [Op.eq]: userAuth.userDetails.username,
        },
      },
    });
    userAuth.reservations = reservations;
    res.render("dashboard", { userAuth });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.render("dbError");
  }
});

module.exports = router;
