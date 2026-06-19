const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
{
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage"
    },

    discountValue: {
        type: Number,
        required: true,
        min: 0
    },

    minimumBookingAmount: {
        type: Number,
        default: 0
    },

    maximumDiscount: {
        type: Number,
        default: null
    },

    usageLimit: {
        type: Number,
        default: 100
    },

    usedCount: {
        type: Number,
        default: 0
    },

    applicableCategories: [
        {
            type: String
        }
    ],

    applicableListings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],

    isActive: {
        type: Boolean,
        default: true
    },

    validFrom: {
        type: Date,
        default: Date.now
    },

    validUntil: {
        type: Date,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}
);

/* Indexes */

couponSchema.index({ code: 1 });
couponSchema.index({ validUntil: 1 });
couponSchema.index({ isActive: 1 });

module.exports = mongoose.model("Coupon", couponSchema);