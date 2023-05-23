const { categories, fetchCategories, selectReviewById, fetchAllReviews, selectCommentByReviewId, insertComment } = require('../models/categories.model');
const endpoints = require('../endpoints.json');

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send({ categories: categories})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getAPI = (req, res, next) => {
    res.status(200).send(endpoints);
}

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params
    selectReviewById(review_id).then((review) => {
        res.status(200).send({ review });
    })
    .catch((err) => {
        next(err)
    })
}

exports.getCommentByReviewId = (req, res, next) => {
    const { review_id } = req.params;
    selectCommentByReviewId(review_id)
    .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch((err) => {
        next(err);
      });
  }
exports.getAllReviews = (req, res, next) => {
    const { sort_by, order_by } = req.query;
    fetchAllReviews(sort_by, order_by).then((reviews) => {
        res.status(200).send({ reviews: reviews})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const {review_id} = req.params;
    insertComment(req.body, review_id).then((comment) => {
        console.log(comment)
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}
