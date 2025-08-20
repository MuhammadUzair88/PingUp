import fs from 'fs';
import imagekit from '../config/ImageKit.js';
import Post from '../models/Post.js';

export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth(); // current user
    const { content, post_type } = req.body; // post data

    const newPostData = {
      user: userId,
      content,
      post_type,
      likes_count: [], // initially no likes
    };

    // Multer gives array of files directly
    const images = req.files;

    if (images && images.length > 0) {
      let imageUrls = [];

      for (const img of images) {
        const buffer = fs.readFileSync(img.path);

        const response = await imagekit.upload({
          fileName: img.originalname,
          file: buffer,
        });

        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: 'auto' },
            { format: 'webp' },
            { width: '512' },
          ],
        });

        imageUrls.push(url);
      }

      newPostData.image_urls = imageUrls;
    }

    const newPost = await Post.create(newPostData);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message,
    });
  }
};





export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.auth(); // get logged-in user id

    // find all posts created by this user
    const posts = await Post.find({ user: userId })
      .populate('user')   // optional: include user details
      .sort({ createdAt: -1 }); // newest first

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};


export const likePost = async (req, res) => {
  try {
    const { userId } = req.auth(); // logged-in user
    const { postId } = req.body; // post id from URL

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // check if user already liked the post
    const alreadyLiked = post.likes_count.includes(userId);

    if (alreadyLiked) {
      // unlike -> remove userId from likes_count
      post.likes_count = post.likes_count.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();

      return res.json({
        success: true,
        message: 'Post unliked',
        post,
      });
    } else {
      // like -> add userId to likes_count
      post.likes_count.push(userId);
      await post.save();

      return res.json({
        success: true,
        message: 'Post liked',
        post,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





