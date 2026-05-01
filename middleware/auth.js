function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please log in to continue.");
    return res.redirect("/login");
  }

  next();
}

module.exports = { isLoggedIn };
