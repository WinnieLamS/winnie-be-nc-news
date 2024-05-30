const db = require("../db/connection");

exports.selectArticleById = (id) => {
    return db 
    .query(`
    SELECT * FROM articles
    WHERE article_id = $1;`, [id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "Not Found" })
        }
        return rows[0];
    })
}


exports.selectArticles = () => {
    return db
    .query(`
    SELECT articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes,
    article_img_url,
    COUNT(comments.article_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    ;`)
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
  
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "This article ID does not exist." })
        }
        return rows[0];
    })
}