import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Story from '../models/story.js';
import User from '../models/user.js';
import { inngest } from '../inngest/index.js';

// --- 1. Add User Story Function ---
export const addUserStory = async (req, res) => {
    let tempFilePath = null;

    try {
        // --- DEBUGGING LOGS ---
        console.log("--- REQUEST RECEIVED ---");
        console.log("User ID from Auth Middleware (req.userId):", req.userId);
        console.log("File information from Multer (req.file):", req.file);
        console.log("Body data (req.body):", req.body);
        console.log("--------------------------");
        // --------------------------------

        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User ID not found after authentication." });
        }

        const { content, media_type, background_color } = req.body;
        const media = req.file
        let media_url = ''

        // Check if media exists and is needed
        if (media && (media_type === 'image' || media_type === 'video')) {
            tempFilePath = media.path; // Store the path for cleanup

            // 🚩 FIX 1: Read the entire file contents into a buffer synchronously (Fixes Broken Image)
            const fileBuffer = fs.readFileSync(tempFilePath);

            // 1. Get original name.
            let safeFileName = media.originalname;

            // 2. Remove spaces, parentheses, and other special characters common in screenshots
            safeFileName = safeFileName
                .replace(/[()\[\]]/g, '')
                .replace(/ /g, '_');


            const response = await imagekit.upload({
                // 🚩 FIX 2: Upload the BUFFER instead of the path
                file: fileBuffer,
                fileName: safeFileName,
            });
            media_url = response.url

            // Cleanup: Immediately delete the temporary file after upload
            fs.unlinkSync(tempFilePath);
            tempFilePath = null;
        }

        // creat story
        const story = await Story.create({
            user: userId,
            // Use the content as received. If it's empty string, that's fine for optional fields.
            content: content,
            media_url,
            media_type,
            background_color
        })

        // 🚩 FIX 4: Send success response FIRST! (Guarantees DB save is confirmed to client)
        res.json({ success: true, message: "Story created successfully" })


        // scheduling story deletion after 24 hours
        // 🚩 FIX 5: Run Inngest in the background AFTER the response has been sent.
        try {
            inngest.send({
                name: 'app/story.delete',
                data: { storyId: story._id }
            })
        } catch (inngestError) {
            console.error("Background Inngest scheduling failed:", inngestError);
        }

    } catch (error) {
        // Log the full error and stack trace
        console.error("Story Creation Failed:", error.name);
        console.error("Error Message:", error.message);
        console.error("Error Details:", error);

        // Contingency Cleanup
        if (tempFilePath) {
            try {
                fs.unlinkSync(tempFilePath);
                console.log(`Cleaned up temp file: ${tempFilePath}`);
            } catch (cleanupError) {
                console.error("Failed to clean up temp file:", cleanupError);
            }
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Story validation failed: ' + error.message });
        }

        res.status(500).json({ success: false, message: error.message })
    }
}

// --- 2. Get Stories Function ---
// 🚩 FIX 6: Ensure 'export const' is used here to resolve the SyntaxError in the router.
export const getStories = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId)

        // const userIds = [userId, ...user.connections, ...user.following]

        // const stories = await Story.find({
        //     user: { $in: userIds }
        // }).populate('user').sort({ createdAt: -1 });

        // TEMPORARY FIX: Show ALL stories for testing
        const stories = await Story.find({})
            .populate('user')
            .sort({ createdAt: -1 });

        console.log(`Stories found for frontend: ${stories.length}`);

        res.json({ success: true, stories })

    } catch (error) {
        console.error("GET Stories Failed:", error);
        res.status(500).json({ success: false, message: error.message })
    }
}