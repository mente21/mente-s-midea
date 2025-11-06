import express from 'express';
import { getChatMessages, sendMessage, ssecontroller } from '../controllers/messageController.js';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';


const messageRouter = express.Router();

messageRouter.get('/:userId', ssecontroller)
messageRouter.post('/send', upload.single('image'), protect, sendMessage)
messageRouter.post('/get', protect, getChatMessages)

export default messageRouter


