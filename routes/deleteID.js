const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Reservation = require("../models/Reservation");
const axios = require("axios");
const dotenv = require("dotenv").config();

router.get("/:deleteID", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const userID = req.oidc.user.sub;
    const deleteID = req.params.deleteID;
    try {
      const reservations = await Reservation.destroy({
        where: {
          username: {
            [Op.eq]: userID,
          },
          booking_id: parseInt(deleteID),
        },
      }).then(async (count) => {
        if (!count) {
          return res.redirect("/dashboard/");
        } else {
          const userAuth = {};
          userAuth.auth = true;
          userAuth.id = req.oidc.user.sub;
          userAuth.deleteCount = count;
          
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
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.render("dbError");
    }
  } else {
    return res.redirect("/login");
  }
});

module.exports = router;
