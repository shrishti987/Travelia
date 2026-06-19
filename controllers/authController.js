const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash(
        "error",
        "Email already registered"
      );
      return res.redirect("/signup");
    }

    const newUser = new User({
      username,
      email
    });

    const registeredUser =
      await User.register(
        newUser,
        password
      );

    req.login(
      registeredUser,
      (err) => {

        if (err) {
          return next(err);
        }

        req.flash(
          "success",
          "Welcome to Travelia!"
        );

        res.redirect("/listings");
      }
    );

  } catch (err) {

    req.flash(
      "error",
      err.message
    );

    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {

  req.flash(
    "success",
    `Welcome back ${req.user.username}`
  );

  const redirectUrl =
    res.locals.redirectUrl || "/listings";

  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {

  req.logout(function (err) {

    if (err) {
      return next(err);
    }

    req.flash(
      "success",
      "Logged out successfully"
    );

    res.redirect("/");
  });
};