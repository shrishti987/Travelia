const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    profileImage: {
        type: String,
        default:
            "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
    },

    role: {
        type: String,
        enum: ["tourist", "guest", "host", "vendor", "organizer", "admin"],
        default: "tourist"
    },

    loyaltyPoints: {
        type: Number,
        default: 1200
    },

    badges: {
        type: [String],
        default: ["Early Explorer"]
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],

    viewedListings: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],

    preferredCategories: {
        type: [String],
        default: []
    },

    notifications: [
        {
            message: String,

            isRead: {
                type: Boolean,
                default: false
            },

            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    lastLogin: {
        type: Date
    }

},
{
    timestamps: true
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
