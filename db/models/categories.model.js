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
        })
    }

    exports.selectCommentByReviewId = (review_id) => {
      return connection
        .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
        .then((reviewResult) => {
          const review = reviewResult.rows[0];
          
          if (!review) {
            return Promise.reject({ status: 404, msg: 'review not found' });
          }
          
          const query = `
            SELECT * 
            FROM comments 
            WHERE review_id = $1
            ORDER BY created_at DESC
          `;
          const values = [review_id];
          
          return connection
            .query(query, values)
            .then((result) => {
              const comments = result.rows;
              if (comments.length === 0) {
                return [];
              } else {
                return comments;
              }
            })
        })
    }

    