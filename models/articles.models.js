const db = require("../db/connection");

exports.selectArticleById = (id) => {
    return db 
    .query(`
    SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [id])
    .then(({rows}) => {

        return rows[0];
    })
}


exports.selectArticles = ({topic}) => {

    const queryValues = [];

    let queryStr = `SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes,
    article_img_url,
    COUNT(comments.article_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id `;


    if(topic){
        queryStr += `WHERE articles.topic = $1 `;
        queryValues.push(topic);
    };

    queryStr += `
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC `;

    return db
    .query(queryStr, queryValues)
    
    .then(({rows}) => {
        
        return rows;
    })
}

exports.checkArticleExists = (id) => {
    return db 
    .query(`
    SELECT * FROM articles
    WHERE article_id = $1;`, [id])
    .then(({rows}) => {
        if (!rows.length){
            return Promise.reject({status: 404, msg: "This article ID does not exist." })
        }
    })
}

exports.updateArticleById = (inc_votes, article_id) => {
    return db 
    .query(`
    UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2 
    RETURNING *;`, [inc_votes, article_id])
    .then(({rows}) => {
        return rows[0];
    })
}