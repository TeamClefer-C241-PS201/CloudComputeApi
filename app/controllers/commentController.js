const express = require("express");
const app = express();
const Comment = require("../models/comment.js");


const createComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;
    const { commentBody } = req.body;
    const commentId = await Comment.create(userId, postId, commentBody);
    res.status(201).json({error:false, commentId, userId, postId, commentBody });
  } catch (error) {
    res.status(400).json({error:true, message: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user ? req.user.userId : null;
    console.log(userId);
    const comments = await Comment.getComment(postId,userId);
    res.status(200).json( comments);
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

const deleteCommentById = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const message = await Comment.deleteById(commentId);
    res.status(200).json({error:false, message });
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

const likeComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const commentId = req.params.commentId;
      const commentLikeId = await Comment.like(userId, commentId);
      res.status(201).json({error:false, commentLikeId, userId, commentId });
    }catch (error) {
      res.status(404).json({error:true, message: error.message });
    }
};


module.exports = {
  createComment,
  getCommentById,
  deleteCommentById,
  likeComment
};
