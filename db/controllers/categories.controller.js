const { categories, fetchCategories } = require('../models/categories.model');

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send({ categories: categories})
    })
    .catch((err) => {
        next(err)
    })
}