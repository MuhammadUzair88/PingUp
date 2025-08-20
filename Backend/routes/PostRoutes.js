import express from 'express';


import { addPost, getUserPosts, likePost } from '../controllers/PostController.js';
import { upload } from '../middlewares/multer.js';
import { protect } from '../middlewares/auth.js';

const postRouter = express.Router();

postRouter.post('/add', upload.array('image', 4), protect, addPost);
postRouter.get('/feed', protect, getUserPosts);
postRouter.post('/like', protect, likePost);

export default postRouter;
