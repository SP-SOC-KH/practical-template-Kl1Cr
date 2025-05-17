const { query } = require('../db');
const { SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION } = require('../errors');

/* module.exports.verifyEmail = function verifyEmail(token) {
    
    const sqlUpdate = `
        UPDATE "User" u
        SET "Is_Active" = TRUE
        FROM "AuthUser" au
        WHERE u."User_ID" = au."User_ID"
        AND au."Verification_Token" = $1
        AND u."Is_Active" = FALSE
        RETURNING u."User_ID"`;
    const sqlClearToken = 'UPDATE "AuthUser" SET "Verification_Token" = NULL WHERE "Verification_Token" = $1';

    return query(sqlUpdate, [token])
        .then(function (updateResult) {
            if (updateResult.rowCount === 0) {
                throw new RAISE_EXCEPTION('Invalid or expired verification token');
            }
            const userId = updateResult.rows[0].User_ID;
            return query(sqlClearToken, [token])
                .then(function () {
                    console.log(`Email verified for user ${userId}`);
                    return true;
                });
        })
        .catch(function (error) {
            if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
                throw new RAISE_EXCEPTION(error.message);
            }
            throw error;
        });
};
 */


module.exports.verifyEmail = function verifyEmail(token) {
    const sqlUpdate = `
        UPDATE "User" u
        SET "Is_Active" = TRUE
        FROM "AuthUser" au
        WHERE u."User_ID" = au."User_ID"
        AND au."Verification_Token" = $1
        AND u."Is_Active" = FALSE
        RETURNING u."User_ID"
    `;

    const sqlClearToken = `
        UPDATE "AuthUser" SET "Verification_Token" = NULL
        WHERE "Verification_Token" = $1
    `;

    const sqlInsertVerification = `
        INSERT INTO "Email_Verification" ("User_ID")
        VALUES ($1)
    `;

    return query(sqlUpdate, [token])
        .then(function (updateResult) {
            if (updateResult.rowCount === 0) {
                throw new RAISE_EXCEPTION('Invalid or expired verification token');
            }

            const userId = updateResult.rows[0].User_ID;

            return query(sqlClearToken, [token])
                .then(() => query(sqlInsertVerification, [userId]))
                .then(() => {
                    console.log(`Email verified and recorded for user ${userId}`);
                    return true;
                });
        })
        .catch(function (error) {
            if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
                throw new RAISE_EXCEPTION(error.message);
            }
            throw error;
        });
};

