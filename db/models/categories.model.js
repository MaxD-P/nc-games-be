const db = require('../connection');

exports.fetchCategories = () => {
    return db.query('SELECT * FROM categories;').then((result) => {
        return result.rows;
    })
}


