const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    description: {
      type: String,
      default: ""
    },

    listings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Listing"
      }
    ],

    isPublic: {
      type: Boolean,
      default: false
    },

    coverImage: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

wishlistSchema.index({ user: 1 });
wishlistSchema.index({ name: "text" });

module.exports = mongoose.model("Wishlist", wishlistSchema);