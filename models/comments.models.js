const db = require("../db/connection");

exports.selectCommentsById = (id) => {
    return db 
    .query(`
    SELECT * FROM comments
    WHERE article_id = $1;`, [id])
    .then(({rows}) => {
        return rows;
    })
}


exports.insertComment = (article_id, username, body) => {
    return db.query(`
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;`, [article_id, username, body])
.then(({ rows }) => {
    return rows[0];
});
};

