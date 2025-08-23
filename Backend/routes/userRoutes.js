import express from 'express';
import { AcceptRequest, discoverUsers, followUser, getUser, GetUserConnections, getUserProfiles, sendConnectionRequest, unFollowUser, UpdateUser } from '../controllers/userController.js';
import { protect } from './../middlewares/auth.js';
import { upload } from './../middlewares/multer.js';
import { getUserRecentMessages } from '../controllers/MessageController.js';

const userRouter=express.Router();

userRouter.get('/data',protect,getUser)
userRouter.post('/update',upload.fields([{name:'profile_picture',maxCount:1},{name:'cover_photo',maxCount:1}]),protect,UpdateUser)
userRouter.post('/discover',protect,discoverUsers)
userRouter.post('/follow',protect,followUser)
userRouter.post('/unfollow',protect,unFollowUser)
userRouter.post('/connect',protect,sendConnectionRequest)
userRouter.post('/accept',protect,AcceptRequest)
userRouter.get('/connections',protect,GetUserConnections)
userRouter.post('/profiles',getUserProfiles)
userRouter.get('/recent-messages',protect,getUserRecentMessages)


export default userRouter;