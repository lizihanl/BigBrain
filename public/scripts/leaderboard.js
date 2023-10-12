"use strict";
const User = require('../../model/user.js')

async function getAllUsers() {
    return await User.aggregate([{
            $addFields: {
                points: {
                    $add: ["$mathGameHighscore", "$memoryGameHighscore", "$geographyGameHighscore"]
                }
            }
        },
        {
            $sort: {
                points: -1
            }
        }
    ])
}

module.exports = getAllUsers