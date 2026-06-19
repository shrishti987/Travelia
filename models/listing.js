const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema(
{
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

    /* CATEGORY */

    category: {
        type: String,
        enum: [
            "Beach",
            "Mountains",
            "City",
            "Camping",
            "Islands"
        ],
        default: "City"
    },

    /* PROPERTY TYPE */

    propertyType: {
        type: String,
        enum: [
            "Apartment",
            "Villa",
            "Hotel",
            "Resort",
            "Cabin",
            "Homestay"
        ],
        default: "Apartment"
    },

    /* PROPERTY DETAILS */

    guests: {
        type: Number,
        default: 1
    },

    bedrooms: {
        type: Number,
        default: 1
    },

    beds: {
        type: Number,
        default: 1
    },

    bathrooms: {
        type: Number,
        default: 1
    },

    /* AMENITIES */

    amenities: [
        {
            type: String
        }
    ],

    /* LOCATION COORDINATES */

    latitude: {
        type: Number,
        default: null
    },

    longitude: {
        type: Number,
        default: null
    },

    /* REVIEWS */

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    avgRating: {
        type: Number,
        default: 0
    },

    /* ANALYTICS */

    viewCount: {
        type: Number,
        default: 0
    },

    bookingCount: {
        type: Number,
        default: 0
    },

    favoriteCount: {
        type: Number,
        default: 0
    },

    /* BOOKING OPTIONS */

    instantBooking: {
        type: Boolean,
        default: false
    },

    availableFrom: {
        type: Date
    },

    availableTo: {
        type: Date
    },

    /* FEATURED LISTINGS */

    featured: {
        type: Boolean,
        default: false
    },

    /* FRAUD DETECTION */

    isFraud: {
        type: Boolean,
        default: false
    },

    fraudReason: {
        type: String,
        default: ""
    },

    /* OWNER */

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    /* SEO URL */

    slug: {
        type: String,
        unique: true,
        sparse: true
    }

},
{
    timestamps: true
}
);

/* SEARCH INDEXES */

listingSchema.index({
    title: "text",
    description: "text",
    location: "text",
    country: "text"
});

listingSchema.index({
    price: 1,
    location: 1,
    category: 1
});

listingSchema.index({
    latitude: 1,
    longitude: 1
});

listingSchema.index({
    featured: 1,
    avgRating: -1
});

listingSchema.index({
    owner: 1
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;