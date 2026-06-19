const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
{
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    provider: {
        type: String,
        enum: ["razorpay", "stripe", "paypal", "manual"],
        default: "razorpay"
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    currency: {
        type: String,
        default: "INR"
    },

    paymentMethod: {
        type: String,
        enum: [
            "card",
            "upi",
            "netbanking",
            "wallet",
            "paypal",
            "unknown"
        ],
        default: "unknown"
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    stripePaymentIntentId: String,

    status: {
        type: String,
        enum: [
            "created",
            "processing",
            "paid",
            "failed",
            "cancelled",
            "refunded"
        ],
        default: "created"
    },

    refundAmount: {
        type: Number,
        default: 0
    },

    refundedAt: Date,

    failureReason: {
        type: String,
        default: ""
    },

    invoiceNumber: {
        type: String,
        unique: true,
        sparse: true
    },

    notes: {
        type: String,
        default: ""
    }
},
{
    timestamps: true
}
);

/* Indexes */

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ booking: 1 });
transactionSchema.index({ listing: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ razorpayOrderId: 1 });
transactionSchema.index({ razorpayPaymentId: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);