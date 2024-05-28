const fs = require("fs/promises")

exports.selectEndpoints = () => {
    return fs.readFile("./endpoints.json", "utf-8")
    .then((data) => {
        // console.log(data);
        const endpointsData = JSON.parse(data);
        return  endpointsData
    })
}