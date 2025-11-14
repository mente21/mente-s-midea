import express from 'express';
import { getChatMessages, sendMessage, ssecontroller } from '../controllers/messageController.js';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';

const messageRouter = express.Router();

// SSE endpoint — should be BEFORE protect
messageRouter.get('/stream/:userId', ssecontroller);

// Message routes
messageRouter.post('/send', protect, upload.single('image'), sendMessage);
messageRouter.post('/get', protect, getChatMessages);

export default messageRouter;
