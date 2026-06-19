const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertyImageSchema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },

    filename: {
      type: String,
      required: true
    },

    url: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      trim: true,
      default: ""
    },

    category: {
      type: String,
      enum: [
        "cover",
        "bedroom",
        "living_room",
        "kitchen",
        "bathroom",
        "balcony",
        "view",
        "other"
      ],
      default: "other"
    },

    displayOrder: {
      type: Number,
      default: 0
    },

    isPrimary: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

propertyImageSchema.index({ listing: 1 });
propertyImageSchema.index({ listing: 1, displayOrder: 1 });

module.exports = mongoose.model(
  "PropertyImage",
  propertyImageSchema
);