const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv").config();

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
        res.render("dashboard", { userAuth });
      })
      .catch(function (error) {
        res.redirect("/logout");
      });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
