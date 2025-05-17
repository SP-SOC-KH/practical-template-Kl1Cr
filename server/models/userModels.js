const { query } = require('../db');
const { SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION } = require('../errors');

module.exports.retrieveAll = function retrieveAll() {
    const sql = `
        SELECT u."User_ID", u."First_Name", u."Last_Name", u."Phone", u."Join_Date", u."Department_ID", 
               u."Role_ID", u."Salary", u."Is_Active", au."Email", au."Username", au."Verification_Token"
        FROM "User" u
        JOIN "AuthUser" au ON u."User_ID" = au."User_ID"`;
    return query(sql).then(function (result) {
        return result.rows;
    });
};

module.exports.createUser = function createUser(firstName, lastName, email, hashedPassword, username, phone, joinDate, departmentId, roleId, salary, verificationToken) {
    let userResult = null; // Define userResult in outer scope

    // Validate Department_ID
    return query('SELECT 1 FROM "Department" WHERE "Department_ID" = $1', [departmentId])
        .then(deptResult => {
            if (deptResult.rowCount === 0) {
                throw new RAISE_EXCEPTION(`Invalid Department_ID: ${departmentId} does not exist`);
            }
            // Validate Role_ID
            return query('SELECT 1 FROM "Role" WHERE "Role_ID" = $1', [roleId]);
        })
        .then(roleResult => {
            if (roleResult.rowCount === 0) {
                throw new RAISE_EXCEPTION(`Invalid Role_ID: ${roleId} does not exist`);
            }
            // Insert into User table
            const sqlUser = 'INSERT INTO "User" ("First_Name", "Last_Name", "Phone", "Join_Date", "Department_ID", "Role_ID", "Salary", "Is_Active") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "User_ID"';
            return query(sqlUser, [firstName, lastName, phone, joinDate, departmentId, roleId, salary, false]);
        })
        .then(function (result) {
            userResult = result; // Assign userResult after successful User insert
            const userId = userResult.rows[0].User_ID;
            // Insert into AuthUser table
            const sqlAuth = 'INSERT INTO "AuthUser" ("User_ID", "Email", "Password", "Username", "Verification_Token") VALUES ($1, $2, $3, $4, $5)';
            return query(sqlAuth, [userId, email, hashedPassword, username, verificationToken])
                .then(function () {
                    console.log('User created');
                    return userId;
                });
        })
        .catch(function (error) {
            // Only attempt cleanup if User insert succeeded
            if (userResult && userResult.rows && userResult.rows[0]) {
                return query('DELETE FROM "User" WHERE "User_ID" = $1', [userResult.rows[0].User_ID])
                    .then(() => { throw error; })
                    .catch(cleanupErr => { 
                        console.error('Cleanup failed:', cleanupErr);
                        throw error; 
                    });
            }
            if (error.code === SQL_ERROR_CODE.UNIQUE_VIOLATION) {
                throw new UNIQUE_VIOLATION_ERROR(`User with email ${email} or username ${username} already exists! Cannot create duplicate.`);
            }
            if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
                throw new RAISE_EXCEPTION(error.message);
            }
            throw error;
        });
};

/* //Find Email
module.exports.findByEmail = function(email) {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
}; */
