// models/Post.js
const db = require("../config/dbConfig");

const Comment = {
  create: async (userId, postId, commentBody) => {
    try {
      const commentDate = new Date().toISOString();
      const [result] = await db.execute(
        "INSERT INTO comments (userId, postId, commentBody, commentDate) VALUES (?, ?, ?, ?)",
        [userId, postId, commentBody, commentDate]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getComment: async (postId) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM comments WHERE postId = ?",
        [postId]
      );
      if (rows.length === 0) {
        throw new Error("Post not found");
      }
      const commentsWithLikers = await Promise.all(rows.map(async (comment) => {
        const [likers] = await db.execute(
          "SELECT COUNT(*) AS likerCount FROM likecomment WHERE commentId = ?",
          [comment.commentId]
        );
        return {
          ...comment,
          likerCount: likers[0].likerCount // Adding the liker count to the comment object
        };
      }));
      return commentsWithLikers;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteById: async (commentId) => {
    try {
      const [result] = await db.execute(
        "DELETE FROM comments WHERE commentId = ?",
        [commentId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Post not found");
      }
      return "Comment deleted successfully";
    } catch (error) {
      throw new Error(error.message);
    }
  },
  like: async (userId, commentId) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO likecomment (userId, commentId) VALUES (?, ?)",
        [userId, commentId]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  unlike: async (commentLikeId) => {
    try {
      const [result] = await db.execute(
        "DELETE FROM likecomment WHERE commentLikeId = ?",
        [commentLikeId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Comment not found");
      }
      return "Comment Deleted Succesfully";
    } catch (error) {
      throw new Error(error.message);
    }
  },
};


module.exports = Comment;
