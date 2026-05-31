var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    ename: "String",
    email: "String",      // Explicit string property mapping for nodemailer routing
    bloodGroup: "String",
    location: "String",
    phone: "String",
    age: "String",        // Added to match your enhanced frontend fields
    weight: "String",     // Added to match your enhanced frontend fields
    status: "String",
});

var userModel = mongoose.model("Donor", userSchema);
module.exports = userModel;