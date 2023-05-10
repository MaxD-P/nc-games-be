const express = require('express');
const app = express();
const connection = require('../db/connection');
const { getCategories, getAPI } = require('../db/controllers/categories.controller');

app.get('/api/categories', getCategories);

app.get('/api', getAPI);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Invalid endpoint" });
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        res.status(500).send({msg: "internal server error"});
    }
})

module.exports = app;