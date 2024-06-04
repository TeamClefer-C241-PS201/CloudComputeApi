const express = require('express');
const app = express();
const Post = require('../models/post');

const createPost = async (req, res) => {
  try {
    const userId = 2; // Misalnya, jika menggunakan sistem autentikasi
    const { postTitle, postDesc } = req.body;
    const postId = await Post.create(userId, postTitle, postDesc);
    res.status(201).json({ postId, userId, postTitle, postDesc });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.getAll();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.getById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deletePostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const message = await Post.deleteById(postId);
    res.status(200).json({ message });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { createPost, getAllPosts, getPostById, deletePostById };
