const express = require('express');
const cors = require('cors');
const app = express();
const { getCategories, getAPI, getReviewById, getAllReviews, getCommentByReviewId, postComment, updateVoteCount } = require('./db/controllers/categories.controller');
app.use(cors());
app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api', getAPI);

app.get('/api/reviews/:review_id', getReviewById);

app.get('/api/reviews/:review_id/comments', getCommentByReviewId)

app.get('/api/reviews', getAllReviews);

app.post('/api/reviews/:review_id/comments', postComment);

app.patch('/api/reviews/:review_id', updateVoteCount);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Invalid endpoint" });
})

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: 'Invalid value. You must input a number.' });
    } else if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        console.log(err);
        res.status(500).send({msg: "internal server error"});
    }
})

module.exports = app;