// controllers/articleController.js
const Article = require('../models/article');

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.getAll();
    res.status(200).json({error:false,
      status: 'success',
      data: articles
    });
  } catch (error) {
    res.status(500).json({error:true,
      status: 'error',
      message: error.message
    });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.getById(req.params.id);
    if (!article) {
      return res.status(404).json({error:true,
        status: 'error',
        message: 'Article not found'
      });
    }
    res.status(200).json({error:false,
      status: 'success',
      data: article
    });
  } catch (error) {
    res.status(500).json({error:true,
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllArticles,
  getArticleById
};
