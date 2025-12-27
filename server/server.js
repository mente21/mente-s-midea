import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { inngest, functions } from './inngest/index.js';
import { serve } from 'inngest/express';
import { clerkMiddleware } from '@clerk/express';
import userRouter from './routes/userRoute.js';
import postRouter from './routes/PostRouts.js';
import storyRouter from './routes/storyRouter.js';
import messageRouter from './routes/messageRoute.js';
import commentRouter from './routes/commentRouter.js';

const app = express();

// Initialize DB connection
connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('server is running'));
// app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/user', userRouter)
app.use('/api/post', postRouter);
app.use('/api/story', storyRouter);
app.use('/api/message', messageRouter);
app.use('/api/comment', commentRouter);

// Export for Vercel
export default app;

// Local listening
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}
