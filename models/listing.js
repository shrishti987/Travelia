const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema ({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: {
        filename: {
            type: String
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1769540209459-ae620b0390ce?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0"
        }
    },
    price: Number,
    location : String,
    country : String,
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
