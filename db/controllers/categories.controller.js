const { categories, fetchCategories } = require('../models/categories.model');
const endpoints = require('../endpoints.json');

console.log(endpoints);

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