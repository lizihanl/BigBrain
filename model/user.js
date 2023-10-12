"use strict";
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String},
    lastname: { type: String},
    password: { type: String},
    userType: { type: String},
    avatarImage: {
        type: String,
        default: 'uploads/default-avatar.png'
    },
    mathGameHighscore: {type: Number},
    memoryGameHighscore: {type: Number},
    geographyGameHighscore: {type: Number}
}, 
{ timestamps: true, toJSON: { virtuals: true } }
);

UserSchema.virtual("posts", { 
    ref: "timeline",
    foreignField: "userID",
    localField: "_id"
});






UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("bby_30_users",UserSchema);