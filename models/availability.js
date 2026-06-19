const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
{
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    priceOverride: {
        type: Number,
        default: null
    },

    minimumStay: {
        type: Number,
        default: 1
    },

    reason: {
        type: String,
        default: ""
    }
},
{
    timestamps: true
}
);

/* Prevent duplicate entries for same listing and date */
availabilitySchema.index(
    { listing: 1, date: 1 },
    { unique: true }
);

/* Fast calendar lookups */
availabilitySchema.index({
    listing: 1,
    isAvailable: 1
});

module.exports = mongoose.model(
    "Availability",
    availabilitySchema
);