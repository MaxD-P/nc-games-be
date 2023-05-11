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

exports.fetchAllReviews = (sort_by = "created_at", order_by = "desc") => {
    const validSortColumns = ["created_at"];
    if (!validSortColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "invalid sort query" });
    }

    const validOrders = ['desc'];
    if (!validOrders.includes(order_by.toLowerCase())) {
        return Promise.reject({ status: 400, msg: "invalid order query" });
    }



    let queryStr =
    `SELECT
    reviews.owner,
    reviews.title,
    reviews.review_id,
    reviews.category,
    reviews.review_img_url,
    reviews.created_at,
    reviews.votes,
    reviews.designer,
    SUM(CASE WHEN comments.comment_id IS NULL THEN 0 ELSE 1 END)::INTEGER AS comment_count
  FROM
    reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY
    reviews.owner,
    reviews.title,
    reviews.review_id,
    reviews.category,
    reviews.review_img_url,
    reviews.created_at,
    reviews.votes,
    reviews.designer
    ORDER BY ${sort_by} ${order_by};
  `;
return connection.query(queryStr).then((result) => {
    return result.rows;
})    
}


