const fs = require("fs/promises")
const db = require("../db/connection");
const endpointsPath = "./endpoints.json";



exports.updateEndpoints = (newData) => {
    return db
    .query(`
    SELECT * FROM articles
    WHERE article_id = $1;`, [3])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
        const newEndpoint = { "GET /api/articles/:article_id": { ...newData, "exampleResponse": rows[0] } };
        return newEndpoint;
    })
    .then((newEndpoint) => {
        return fs.readFile(endpointsPath, "utf-8")
        .then((data) => {
            const endpointsData = JSON.parse(data);
            Object.assign(endpointsData, newEndpoint);
            const updatedEndpointsJSON = JSON.stringify(endpointsData, null, 2);
            return fs.writeFile(endpointsPath, updatedEndpointsJSON, "utf-8")
            .then(() => newEndpoint);
        });
    })
    .then((newEndpoint) => {
        const endpointKey = "GET /api/articles/:article_id";
        return newEndpoint[endpointKey];
    });
};
