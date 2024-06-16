const db = require("../db/connection");

exports.selectUsers = ({username, sort_by, order}) => {
    const queryValues = [];
    // console.log(sort_by, "<<<from model");
    // console.log(order, "<<<from model");

    let queryStr = `SELECT * FROM users`;

    if (username){
        queryStr += ` WHERE username = $1 `;
        queryValues.push(username)
    }

    if (sort_by){
        queryStr += `
        ORDER BY ${sort_by} ${order}`;
    }


    return db
    .query(queryStr, queryValues)
    
    .then(({rows}) => {
        return rows;
    })
}

exports.checkUsenameExists = ({username}) => {
    return db 
    .query(`
    SELECT * FROM users
    WHERE username = $1;`, [username])
    .then(({rows}) => {
        if (!rows.length){
            return Promise.reject({status: 404, msg: "This username does not exist." })
        }
    })
}