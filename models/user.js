const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    // 🔥 Track what user has viewed
    viewedListings: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],

    // ❤️ Wishlist (ADD THIS HERE)
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],

    // 🔥 Track preferred categories
    preferredCategories: {
        type: [String],
        default: []
    }
});

// Keep this at the end (VERY IMPORTANT)
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);