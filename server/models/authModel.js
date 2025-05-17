// models/authModel.js
const { query } = require('../db');



module.exports.getUserByEmail = function getUserByEmail(email) {
    const sql = `
        SELECT u."Is_Active", au."Password"
        FROM "AuthUser" au
        JOIN "User" u ON u."User_ID" = au."User_ID"
        WHERE au."Email" = $1
    `;
    return query(sql, [email]).then(function (result) {
        return result.rows[0];
    });
}