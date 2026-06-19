const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    action: {
        type: String,
        required: true
    },

    entityType: {
        type: String,
        enum: [
            "User",
            "Listing",
            "Booking",
            "Review",
            "Transaction"
        ]
    },

    entityId: {
        type: mongoose.Schema.Types.ObjectId
    },

    details: {
        type: Object,
        default: {}
    },

    ipAddress: {
        type: String,
        default: ""
    },

    userAgent: {
        type: String,
        default: ""
    }
},
{
    timestamps: true
}
);

/* Indexes */

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);