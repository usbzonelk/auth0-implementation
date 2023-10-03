const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Reservation = require("../models/Reservation");

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
      });
      console.log(reservations);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error fetching data:", error);
      res.render("dbError");
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
