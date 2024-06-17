// models/Article.js
const db = require("../config/dbConfig");

const Article = {
    getAll: () => {
      return db.execute('SELECT * FROM articles');
    },
    getById: (id) => {
      return db.execute('SELECT * FROM articles WHERE articleId = ?', [id]);
    }
  };

module.exports = Article;
