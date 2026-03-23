const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/travelia";

const Listing = require("./models/listing.js");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });

const Review = require("./models/review.js");
const Booking = require("./models/booking");

/* AUTH */
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const session = require("express-session");

/* ---------------- DATABASE ---------------- */
main()
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

/* ---------------- MIDDLEWARE ---------------- */

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));

/* SESSION */
app.use(session({
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
}));

const flash = require("connect-flash");
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

/* PASSPORT */
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ---------------- AUTH ---------------- */

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

/* ---------------- VALIDATION ---------------- */

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate({ listing: req.body.listing });

  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

/* ---------------- FRAUD DETECTION ---------------- */

function checkFraud(listing) {
  let isFraud = false;
  let reason = "";

  if (listing.price < 100) {
    isFraud = true;
    reason = "Price too low";
  }

  if (listing.title.toLowerCase().includes("free")) {
    isFraud = true;
    reason = "Suspicious keyword";
  }

  return { isFraud, reason };
}

/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => {
  res.render("home");
});

/* AUTH */

app.get("/signup", (req, res) => res.render("users/signup"));

app.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, err => {
      if (err) return next(err);
      res.redirect("/listings");
    });

  } catch (e) {
    next(e);
  }
});

app.get("/login", (req, res) => res.render("users/login"));

app.post("/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/listings")
);

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/listings"));
});

/* PROFILE */

app.get("/profile", isLoggedIn, (req, res) => {
  res.render("users/profile", { currUser: req.user });
});

/* ⭐ MY LISTINGS (FIXED) */

app.get("/mylistings", isLoggedIn, wrapAsync(async (req, res) => {

  const listings = await Listing.find({
    owner: req.user._id
  });

  res.render("listings/index", { listings });

}));

/* SEARCH */

app.get("/search", wrapAsync(async (req, res) => {
  const { location, country, minPrice, maxPrice } = req.query;
  let query = {};

  if (location) query.location = { $regex: location, $options: "i" };
  if (country) query.country = { $regex: country, $options: "i" };

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  const listings = await Listing.find(query);
  res.render("listings/index", { listings });
}));

/* INDEX */

app.get("/listings", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
}));

/* CATEGORY (FIXED) */

/* ⭐ Category Filter Route (DEBUG VERSION) */

app.get("/category/:category", async (req, res) => {
  console.log("CATEGORY CLICKED:", req.params.category);

  let { category } = req.params;

  const categoryMap = {
    beach: "Beach",
    beaches: "Beach",
    mountain: "Mountains",
    mountains: "Mountains",
    city: "City",
    camping: "Camping",
    island: "Islands",
    islands: "Islands"
  };

  category = categoryMap[category.toLowerCase()];

  console.log("AFTER MAP:", category);

  const listings = await Listing.find({ category });

  console.log("FOUND:", listings.length);

  res.render("listings/index", { listings });
});
  
    
/* RECOMMENDATIONS */

app.get("/recommendations", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id);

  let listings = [];

  if (user.preferredCategories && user.preferredCategories.length > 0) {
    listings = await Listing.find({
      category: { $in: user.preferredCategories },
      _id: { $nin: user.viewedListings || [] }
    }).limit(10);
  }

  if (listings.length === 0) {
    listings = await Listing.find().limit(10);
  }

  res.render("listings/index", {
    listings,
    isRecommendation: true
  });
});

/* NEW */

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

/* SHOW */

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");

  if (!listing) throw new ExpressError(404, "Listing not found");

  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { viewedListings: listing._id }
    });
  }

  res.render("listings/show", { listing });
}));


/* ---------------- BOOKINGS ---------------- */

// CREATE BOOKING
app.post("/listings/:id/book",
  isLoggedIn,
  wrapAsync(async (req, res) => {

    const { id } = req.params;
    const { checkIn, checkOut } = req.body;

    // ❌ Invalid date
    if (new Date(checkOut) <= new Date(checkIn)) {
      throw new ExpressError(400, "Invalid date selection");
    }

    // ✅ Days calc
    const diffTime = new Date(checkOut) - new Date(checkIn);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 30) {
      throw new ExpressError(400, "Booking too long (max 30 days)");
    }

    // 🛑 PREVENT DUPLICATE BOOKING
    const existingBooking = await Booking.findOne({
  user: req.user._id,
  listing: id
});

if (existingBooking) {
  throw new ExpressError(400, "You already booked this listing");
}

    const listing = await Listing.findById(id);

    const totalPrice = diffDays * listing.price;

    const newBooking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn,
      checkOut,
      totalPrice
    });

    await newBooking.save();

    res.redirect("/trips");
  })
);

// MY TRIPS
app.get("/trips", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/trips", { bookings });
});

/* CREATE */

app.post("/listings",
  isLoggedIn,
  upload.single("image"),
  validateListing,
  wrapAsync(async (req, res) => {

    const newListing = new Listing(req.body.listing);
    // TEMP LOGIC (later replace with ML)
if (newListing.price < 500) {
  newListing.isFraud = true;
  newListing.fraudReason = "Price too low";
} else {
  newListing.isFraud = false;
}

    // ✅ attach owner
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = req.file.path;
    }

    const fraud = checkFraud(newListing);
    newListing.isFraud = fraud.isFraud;
    newListing.fraudReason = fraud.reason;

    await newListing.save();

    res.redirect("/listings");
  })
);

/* EDIT */

app.get("/listings/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  res.render("listings/edit.ejs", { listing });
}));

/* UPDATE */

app.put("/listings/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {

    await Listing.findByIdAndUpdate(req.params.id, {
      ...req.body.listing
    });

    res.redirect(`/listings/${req.params.id}`);
  })
);

/* DELETE */

app.delete("/listings/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {

    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
  })
);

/* ❤️ WISHLIST */

app.post("/wishlist/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const listingId = req.params.id;

  // Add if not already present
  if (!user.wishlist.includes(listingId)) {
    user.wishlist.push(listingId);
  }

  await user.save();

  res.redirect("/listings");
}));
/* ERROR */

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).render("error", {
    message: err.message || "Something went wrong"
  });
});

/* SERVER */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});