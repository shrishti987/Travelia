const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
title: {
    type: String,
    required: true,
    trim: true
},

description: {
    type: String,
    required: true
},

image: {
    filename: String,
    url: {
        type: String,
        default:
        "https://images.unsplash.com/photo-1769540209459-ae620b0390ce?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0"
    }
},

price: {
    type: Number,
    required: true,
    min: 0
},

location: {
    type: String,
    required: true
},

country: {
    type: String,
    required: true
},

/* ⭐ Category (NEW FEATURE) */

category: {
    type: String,
    enum: ["Beach","Mountains","City","Camping","Islands"],
    default: "City"
},

/* ⭐ Reviews Relationship */

reviews: [
    {
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
],

/* ⭐ Average Rating */

avgRating: {
    type: Number,
    default: 0
},

/* 🚨 Fraud Detection Fields */
isFraud: {
    type: Boolean,
    default: false
},

fraudReason: {
    type: String,
    default: ""
},

/* 👤 Owner (ADD THIS) */
owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
},

/* Created Time */

createdAt: {
    type: Date,
    default: Date.now
}

});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
