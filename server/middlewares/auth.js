// middlewares/auth.js

export const protect = async (req, res, next) => {
    try {
        const { userId } = await req.auth();
        if (!userId) {
            // Use 401 Unauthorized status for authentication failures
            return res.status(401).json({ success: false, message: "not authenticated" })
        }

        // FIX: Attach the userId directly to the request object
        req.userId = userId;

        next()
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}