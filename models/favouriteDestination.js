const mongoose = require("mongoose");

const favoriteDestinationSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    destinationName: {
        type: String,
        required: true,
        trim: true
    },

    country: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        default: ""
    },

    category: {
        type: String,
        default: ""
    },

    visitCount: {
        type: Number,
        default: 0
    },

    notes: {
        type: String,
        default: ""
    },

    isPinned: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
);

/* Prevent duplicate destination for same user */

favoriteDestinationSchema.index(
    {
        user: 1,
        destinationName: 1
    },
    {
        unique: true
    }
);

/* Fast retrieval */

favoriteDestinationSchema.index({
    user: 1,
    createdAt: -1
});

module.exports = mongoose.model(
    "FavoriteDestination",
    favoriteDestinationSchema
);