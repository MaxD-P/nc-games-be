const connection = require('../connection');
const db = require('../connection');

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories;').then((result) => {
        return result.rows;
    })
}

exports.selectReviewById = (review_id) => {
    return connection
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "review not found"});
        } else {
            return result.rows[0]
        }
        });
    }


