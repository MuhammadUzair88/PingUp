import express from 'express';
import { discoverUsers, followUser, getUser, unFollowUser, UpdateUser } from '../controllers/userController.js';
import { protect } from './../middlewares/auth.js';
import { upload } from './../middlewares/multer.js';

const userRouter=express.Router();

userRouter.get('/data',protect,getUser)
userRouter.post('/update',upload.fields([{name:'profile',maxCount:1},{name:'cover',maxCount:1}]),protect,UpdateUser)
userRouter.post('/discover',protect,discoverUsers)
userRouter.post('/follow',protect,followUser)
userRouter.post('/unfollow',protect,unFollowUser)

export default userRouter;