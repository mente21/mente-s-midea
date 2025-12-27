import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// Add a comment
export const addComment = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId, text } = req.body;

        if (!text) {
            return res.json({ success: false, message: "Comment text is required" });
        }

        const comment = await Comment.create({
            post: postId,
            user: userId,
            text
        });

        // Populate user info for the response
        const populatedComment = await Comment.findById(comment._id).populate('user');

        res.json({ success: true, message: "Comment added successfully", comment: populatedComment });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get comments for a post
export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId })
            .populate('user')
            .sort({ createdAt: -1 });

        res.json({ success: true, comments });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
