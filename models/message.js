const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },

    attachments: [
      {
        filename: String,
        url: String,
        fileType: String,
        size: Number
      }
    ],

    isRead: {
      type: Boolean,
      default: false
    },

    readAt: Date,

    isEdited: {
      type: Boolean,
      default: false
    },

    editedAt: Date,

    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedAt: Date
  },
  {
    timestamps: true
  }
);

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ isRead: 1 });

module.exports = mongoose.model("Message", messageSchema);