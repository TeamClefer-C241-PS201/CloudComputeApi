// models/Post.js
const db = require('../config/dbConfig');

const Post = {
  create: async (userId, postTitle, postDesc) => {
    try {
      const postDate = new Date().toISOString();
      const [result] = await db.execute('INSERT INTO posts (userId, postTitle, postDesc, postDate) VALUES (?, ?, ?, ?)', [userId, postTitle, postDesc, postDate]);
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getAll: async () => {
    try {
      const [rows] = await db.execute('SELECT * FROM posts');
      const postsWithLikers = await Promise.all(rows.map(async (posts) => {
        const [likers] = await db.execute(
          "SELECT COUNT(*) AS likerCount FROM likepost WHERE postId = ?",
          [posts.postId]
        );
        return {
          ...posts,
          likerCount: likers[0].likerCount // Adding the liker count to the comment object
        };
      }));;
      return postsWithLikers;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getById: async (postId) => {
    try {
      const [rows] = await db.execute('SELECT * FROM posts WHERE postId = ?', [postId]);
      if (rows.length === 0) {
        throw new Error('Post not found');
      }
      const postsWithLikers = await Promise.all(rows.map(async (posts) => {
        const [likers] = await db.execute(
          "SELECT COUNT(*) AS likerCount FROM likepost WHERE postId = ?",
          [posts.postId]
        );
        return {
          ...posts,
          likerCount: likers[0].likerCount // Adding the liker count to the comment object
        };
      }));;
      return postsWithLikers[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteById: async (postId) => {
    try {
      const [result] = await db.execute('DELETE FROM posts WHERE postId = ?', [postId]);
      if (result.affectedRows === 0) {
        throw new Error('Post not found');
      }
      return 'Post deleted successfully';
    } catch (error) {
      throw new Error(error.message);
    }
  },
  like: async (userId, postId) => {
    try {
      const [result] = await db.execute('INSERT INTO likepost (userId, postId) VALUES (?, ?)', [userId, postId]);
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = Post;