const express = require("express");
const router = express.Router();
const platform = require("../data/platformData");

router.get("/planner", (req, res) => {
  res.render("platform/planner", {
    ...platform,
    plannerResult: platform.buildItinerary()
  });
});

router.post("/planner", (req, res) => {
  res.render("platform/planner", {
    ...platform,
    plannerResult: platform.buildItinerary(req.body)
  });
});

router.get("/experiences", (req, res) => {
  res.render("platform/experiences", platform);
});

router.get("/events", (req, res) => {
  res.render("platform/events", platform);
});

router.get("/marketplace", (req, res) => {
  res.render("platform/marketplace", platform);
});

router.get("/impact", (req, res) => {
  res.render("platform/impact", platform);
});

router.get("/sos", (req, res) => {
  res.render("platform/sos", platform);
});

router.get("/cart", (req, res) => {
  const subtotal = platform.cartItems.reduce((sum, item) => sum + item.price, 0);
  res.render("platform/cart", {
    ...platform,
    subtotal,
    serviceFee: Math.round(subtotal * 0.04),
    localContribution: Math.round(subtotal * 0.12)
  });
});

router.get("/roles", (req, res) => {
  res.render("platform/roles", {
    ...platform,
    activeRole: "tourist"
  });
});

router.get("/roles/:role", (req, res) => {
  const activeRole = platform.roles.some((role) => role.id === req.params.role)
    ? req.params.role
    : "tourist";

  res.render("platform/roles", {
    ...platform,
    activeRole
  });
});

module.exports = router;
