const moment = require("moment");

// Get day before timestamp
// Sub 18 is used because there is a time
// difference on google server and it returns
// wrong value
module.exports.getYesterdayStamp = async () => {
    return moment(moment().startOf("day"))
        .subtract(18, "hours")
        .valueOf();
};

module.exports.print = async (admin, stamp) => {
    admin
        .database()
        .ref(`todos`)
        .child(`oFmZyn1qqwXO1cXTwTYRtlpAb8J3/${stamp}/categories/`)
        .on("value", categories => {
            categories.forEach(category => {
                category.forEach(todo => {
                    key = todo.val().key;
                    value = todo.val().value;
                    console.log("key: " + key);
                    console.log("value: " + value);
                });
            });
        });
};
