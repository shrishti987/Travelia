const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/authController");

/* =========================
   SIGNUP
========================= */

router.get(
  "/signup",
  authController.renderSignup
);

router.post(
  "/signup",
  authController.signup
);

/* =========================
   LOGIN
========================= */

router.get(
  "/login",
  authController.renderLogin
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  authController.login
);

/* =========================
   LOGOUT
========================= */

router.get(
  "/logout",
  authController.logout
);

module.exports = router;