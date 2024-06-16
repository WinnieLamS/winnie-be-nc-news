const {selectUsers, checkUsenameExists} = require("../models/users.models")


exports.getUsers = (req, res, next) => {
    const {username} = req.params;
    const { sort_by, order = 'desc'} = req.query


    const validSortColumns = ['username', 'name']
    const validOrders = ['asc', 'desc'];

    // console.log(sort_by, "<<<before if");
    // console.log(order, "<<<before if");
    if (sort_by){
        if (!validSortColumns.includes(sort_by) || !validOrders.includes(order)) {
            return next({ status: 400, msg: "Bad Request" });
            }
    }

    const promises = [selectUsers({username, sort_by, order})]

    if (username){
        promises.push(checkUsenameExists({username}))
    }

    Promise.all(promises)
    .then((resolvedPromises) => {
        const userArr = resolvedPromises[0]
        res.status(200).send({userArr});
    })
    .catch(next)
};