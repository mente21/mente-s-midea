// routes/storyRouter.js

import express from 'express';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';
// This import is now correct because both functions are exported in the controller
import { addUserStory, getStories } from '../controllers/storyController.js';


const storyRouter = express.Router()

storyRouter.post('/create', upload.single('media'), protect, addUserStory)
storyRouter.get('/get', protect, getStories)

export default storyRouter