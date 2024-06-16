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

    getAll: async (userId) => {
      try {
        const [rows] = await db.execute(
          `SELECT p.*, 
                  COALESCE(l.likeCount, 0) AS likerCount, 
                  COALESCE(ls.likeStatus, 0) AS likeStat, 
                  COALESCE(c.commentCount, 0) AS commentCount 
           FROM posts p 
           LEFT JOIN (
               SELECT postId, COUNT(*) AS likeCount 
               FROM likepost 
               GROUP BY postId
           ) l ON p.postId = l.postId 
           LEFT JOIN (
               SELECT postId, 1 AS likeStatus 
               FROM likepost 
               WHERE userId = ?
           ) ls ON p.postId = ls.postId 
           LEFT JOIN (
               SELECT postId, COUNT(*) AS commentCount 
               FROM comments 
               GROUP BY postId
           ) c ON c.postId = p.postId`,
          [userId || null]
        );
        return rows;
      } catch (error) {
        throw new Error(error.message);
      }
    },

  getById: async (postId) => {
    try {
      const [rows] = await db.execute('SELECT p.userId, postId, postTitle, postDesc, postDate, name, createdAt FROM posts p LEFT JOIN users u on p.userId = u.userId WHERE postId = ?', [postId]);
      if (rows.length === 0) {
        throw new Error('Post not found');
      }
      const postsWithLikers = await Promise.all(rows.map(async (posts) => {
        const [likers] = await db.execute(
          "SELECT COUNT(*) AS likerCount FROM likepost WHERE postId = ?",
          [posts.postId]
        );
        const [comments] = await db.execute(
          "SELECT COUNT(*) AS commentCount FROM comments where postId =?",
          [posts.postId]
        );
        return {
          ...posts,
          likerCount: likers[0].likerCount, // Adding the liker count to the comment object
          commentCount: comments[0].commentCount // Adding comment count
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
      const [like] = await db.execute("Select postLikeId FROM likepost where userId= ? AND postId = ?",[userId,postId]);
      const firstlike = like[0]
      if(like.length > 0){
        await db.execute(
          "DELETE FROM likepost WHERE postLikeId = ?",
          [firstlike.postLikeId]
        );
        return "Unlike Post!";
      }
      const [result] = await db.execute(
        "INSERT INTO likepost (userId, postId) VALUES (?, ?)",
        [userId, postId]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};


module.exports = Post;