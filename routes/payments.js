const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware/auth");
const paymentController = require("../controllers/paymentController");

router.get("/:id/checkout", isLoggedIn, wrapAsync(paymentController.checkout));
router.post("/verify", isLoggedIn, wrapAsync(paymentController.verify));
router.get("/success/:id", isLoggedIn, wrapAsync(paymentController.success));
router.get("/failure/:id", isLoggedIn, wrapAsync(paymentController.failure));

module.exports = router;
