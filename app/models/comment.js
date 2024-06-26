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

  getComment: async (postId,userId) => {
    try {
      const [rows] = await db.execute(
        "SELECT c.userId, commentId, postId, commentBody, commentDate, name, createdAt FROM comments c LEFT JOIN users u on c.userId = u.userId WHERE postId = ?",
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
        const [likestatus] = await db.execute(
          "SELECT COALESCE((SELECT 1 FROM likecomment WHERE commentId = ? AND userId = ?), 0) AS likeStat;",
          [comment.commentId,userId || null]
        );
        return {
          ...comment,
          likerCount: likers[0].likerCount, // Adding the liker count to the comment object
          likeStat: likestatus[0].likeStat // Adding the like status
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
      const [like] = await db.execute("Select commentLikeId FROM likecomment where userId= ? AND commentId = ?",[userId,commentId])
      const firstlike = like[0]
      if(like.length > 0){
        await db.execute(
          "DELETE FROM likecomment WHERE commentLikeId = ?",
          [firstlike.commentLikeId]
        );
        return "Unlike Post!";
      }
      const [result] = await db.execute(
        "INSERT INTO likecomment (userId, commentId) VALUES (?, ?)",
        [userId, commentId]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};


module.exports = Comment;
