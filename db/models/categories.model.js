const db = require('../connection');

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories;').then((result) => {
        console.log(result.rows, "in the model")
        return result.rows;
    })
}


