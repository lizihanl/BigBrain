"use strict";
const User = require('../../model/user.js')

async function getAllInfo() {
    return await User.find();
}

module.exports = getAllInfo