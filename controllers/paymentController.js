const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const { createOrder, verifySignature } = require("../services/paymentService");
const ExpressError = require("../utils/ExpressError");

module.exports.checkout = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate("listing");

  if (!booking) {
    throw new ExpressError(404, "Booking not found");
  }

  if (booking.paymentStatus === "paid") {
    return res.redirect(`/payments/success/${booking._id}`);
  }

  const payment = await createOrder({
    amount: booking.totalPrice,
    receipt: `booking_${booking._id}`
  });

  if (payment.paymentEnabled) {
    booking.razorpayOrderId = payment.order.id;
    await booking.save();

    await Transaction.findOneAndUpdate(
      { booking: booking._id },
      {
        booking: booking._id,
        user: booking.user,
        listing: booking.listing._id,
        amount: booking.totalPrice,
        currency: booking.currency,
        provider: "razorpay",
        razorpayOrderId: payment.order.id,
        status: "created"
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  res.render("payments/checkout", {
    booking,
    payment
  });
};

module.exports.verify = async (req, res) => {
  const {
    bookingId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const booking = await Booking.findOne({
    _id: bookingId,
    user: req.user._id
  });

  if (!booking) {
    throw new ExpressError(404, "Booking not found");
  }

  const isValid = verifySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature
  });

  if (!isValid || razorpay_order_id !== booking.razorpayOrderId) {
    booking.paymentStatus = "failed";
    await booking.save();

    await Transaction.findOneAndUpdate(
      { booking: booking._id },
      {
        status: "failed",
        failureReason: "Payment signature verification failed"
      }
    );

    req.flash("error", "Payment verification failed.");
    return res.redirect(`/payments/failure/${booking._id}`);
  }

  booking.paymentStatus = "paid";
  booking.razorpayPaymentId = razorpay_payment_id;
  await booking.save();

  await Transaction.findOneAndUpdate(
    { booking: booking._id },
    {
      status: "paid",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    }
  );

  req.flash("success", "Payment completed successfully.");
  res.redirect(`/payments/success/${booking._id}`);
};

module.exports.success = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate("listing");

  if (!booking) {
    throw new ExpressError(404, "Booking not found");
  }

  res.render("payments/success", { booking });
};

module.exports.failure = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate("listing");

  if (!booking) {
    throw new ExpressError(404, "Booking not found");
  }

  res.render("payments/failure", { booking });
};
