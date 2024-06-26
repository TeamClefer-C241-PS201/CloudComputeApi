const express = require("express");
const app = express();
const Post = require("../models/post");


const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postTitle, postDesc } = req.body;
    const postId = await Post.create(userId, postTitle, postDesc);
    res.status(201).json({error:false, postId, userId, postTitle, postDesc });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const userId =req.user ? req.user.userId : null;
    console.log(userId)
    const posts = await Post.getAll(userId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({error:true, message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user ? req.user.userId : null;
    const post = await Post.getById(postId,userId);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

const deletePostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const message = await Post.deleteById(postId);
    res.status(200).json({error:false, message });
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;
    const postLikeId = await Post.like(userId, postId);
    res.status(201).json({error:false, postLikeId, userId, postId});
  } catch (error) {
    res.status(400).json({error:true, message: error.message });
  }
};

module.exports = { createPost, getAllPosts, getPostById, deletePostById, likePost};
