const express = require("express");
require("dotenv").config({ quiet: true });
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/travelia";

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
const paymentRoutes = require("./routes/payments");
const reviewRoutes = require("./routes/review");
const wishlistRoutes = require("./routes/wishlist");
const dashboardRoutes = require("./routes/dashboard");
const platformRoutes = require("./routes/platform");
const platformData = require("./data/platformData");

const LISTING_CARD_FIELDS = "title image price location country category avgRating isFraud createdAt";
const LISTING_CATEGORIES = ["Beach", "Mountains", "City", "Camping", "Islands"];
const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1, createdAt: -1 },
  price_desc: { price: -1, createdAt: -1 },
  rating: { avgRating: -1, createdAt: -1 }
};

function escapeRegex(value = "") {
  return String(value).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanFilter(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parsePrice(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function getListingSort(sortKey) {
  return SORT_OPTIONS[sortKey] || SORT_OPTIONS.newest;
}

function getActiveSort(sortKey) {
  return SORT_OPTIONS[sortKey] ? sortKey : "newest";
}

/* AUTH */
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const session = require("express-session");

/* ---------------- DATABASE ---------------- */
mongoose.set("strictQuery", true);

main()
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

/* ---------------- MIDDLEWARE ---------------- */

app.set("views", path.join(__dirname, "views"));
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true, limit: "500kb" }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public"), {
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "7d" : 0
}));

/* SESSION */
app.use(session({
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
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
  res.locals.wishlistIds = req.user?.wishlist?.map(id => id.toString()) || [];
  res.locals.razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
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
  res.render("home", platformData);
});

/* AUTH */

app.get("/signup", (req, res) => res.render("users/signup"));

app.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const allowedRoles = ["tourist", "host", "vendor", "organizer"];

    if (!password || password.length < 8) {
      req.flash("error", "Password must be at least 8 characters long.");
      return res.redirect("/signup");
    }

    const newUser = new User({
      email,
      username,
      role: allowedRoles.includes(role) ? role : "tourist"
    });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, err => {
      if (err) return next(err);
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) => res.render("users/login"));

app.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password."
  }),
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

  const listings = await Listing.find({ owner: req.user._id })
    .select(LISTING_CARD_FIELDS)
    .sort({ createdAt: -1 })
    .lean();

  res.render("listings/index", { listings, filters: {}, activeSort: "newest" });

}));

/* SEARCH */

app.get("/search", wrapAsync(async (req, res) => {
  const category = cleanFilter(req.query.category);
  const minPrice = parsePrice(req.query.minPrice);
  const maxPrice = parsePrice(req.query.maxPrice);
  const filters = {
    q: cleanFilter(req.query.q),
    location: cleanFilter(req.query.location),
    country: cleanFilter(req.query.country),
    minPrice: minPrice !== undefined ? String(minPrice) : "",
    maxPrice: maxPrice !== undefined ? String(maxPrice) : "",
    category: LISTING_CATEGORIES.includes(category) ? category : "",
    sort: getActiveSort(req.query.sort)
  };
  const query = {};

  if (filters.q) {
    const searchRegex = new RegExp(escapeRegex(filters.q), "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { location: searchRegex },
      { country: searchRegex }
    ];
  }
  if (filters.location) query.location = new RegExp(escapeRegex(filters.location), "i");
  if (filters.country) query.country = new RegExp(escapeRegex(filters.country), "i");
  if (filters.category) query.category = filters.category;

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  const listings = await Listing.find(query)
    .select(LISTING_CARD_FIELDS)
    .sort(getListingSort(filters.sort))
    .lean();

  res.render("listings/index", { listings, filters, activeSort: filters.sort });
}));

/* INDEX */

app.get("/listings", wrapAsync(async (req, res) => {
  const activeSort = getActiveSort(req.query.sort);
  const listings = await Listing.find({})
    .select(LISTING_CARD_FIELDS)
    .sort(getListingSort(activeSort))
    .lean();

  res.render("listings/index", { listings, filters: { sort: activeSort }, activeSort });
}));

/* CATEGORY (FIXED) */

/* ⭐ Category Filter Route (DEBUG VERSION) */

app.get("/category/:category", wrapAsync(async (req, res) => {
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

  category = categoryMap[category.toLowerCase()] || category;

  const listings = LISTING_CATEGORIES.includes(category)
    ? await Listing.find({ category })
      .select(LISTING_CARD_FIELDS)
      .sort({ createdAt: -1 })
      .lean()
    : [];

  res.render("listings/index", {
    listings,
    filters: { category, sort: "newest" },
    activeSort: "newest"
  });
}));
  
    
/* RECOMMENDATIONS */

app.get("/recommendations", isLoggedIn, wrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id);

  let listings = [];

  if (user.preferredCategories && user.preferredCategories.length > 0) {
    listings = await Listing.find({
      category: { $in: user.preferredCategories },
      _id: { $nin: user.viewedListings || [] }
    })
      .select(LISTING_CARD_FIELDS)
      .sort({ avgRating: -1, createdAt: -1 })
      .limit(10)
      .lean();
  }

  if (listings.length === 0) {
    listings = await Listing.find()
      .select(LISTING_CARD_FIELDS)
      .sort({ avgRating: -1, createdAt: -1 })
      .limit(10)
      .lean();
  }

  res.render("listings/index", {
    listings,
    filters: {},
    activeSort: "rating",
    isRecommendation: true
  });
}));

/* NEW */

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

/* SHOW */

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate({
    path: "reviews",
    populate: { path: "author" }
  });

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

    const listing = await Listing.findById(id).select("price");
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    const totalPrice = diffDays * listing.price;

    const newBooking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn,
      checkOut,
      nights: diffDays,
      totalPrice,
      paymentStatus: "pending"
    });

    await newBooking.save();

    res.redirect(`/payments/${newBooking._id}/checkout`);
  })
);

// MY TRIPS
app.get("/trips", isLoggedIn, wrapAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing", "title image location country price")
    .sort({ createdAt: -1 })
    .lean();

  res.render("bookings/trips", { bookings });
}));

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
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
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
    const listingData = { ...req.body.listing };

    if (typeof listingData.image === "string") {
      listingData.image = {
        url: listingData.image,
        filename: "external-image"
      };
    }

    await Listing.findByIdAndUpdate(req.params.id, {
      ...listingData
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
  const listingId = req.params.id;
  const exists = await User.exists({
    _id: req.user._id,
    wishlist: listingId
  });

  if (exists) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: listingId }
    });
  } else {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: listingId }
    });
  }

  res.redirect(req.get("Referrer") || "/listings");
}));

app.use("/", platformRoutes);
app.use("/payments", paymentRoutes);
app.use("/", reviewRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/dashboard", dashboardRoutes);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
