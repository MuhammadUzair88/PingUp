import express from 'express';


import { addUserStory, getUserStories } from '../controllers/StoryController.js';
import { upload } from '../middlewares/multer.js';
import { protect } from '../middlewares/auth.js';


const storyRouter = express.Router();

storyRouter.post('/create', upload.single('media'), protect, addUserStory);
storyRouter.get('/get', protect, getUserStories);

export default storyRouter;
