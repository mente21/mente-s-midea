import imagekit from "../configs/imageKit.js";
import { inngest } from "../inngest/index.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import User from "../models/user.js";
import fs from 'fs'




import { clerkClient } from "@clerk/express";

// get user data using userID
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        let user = await User.findById(userId);

        if (!user) {
            // If user not found in DB, sync from Clerk manually (Self-healing)
            try {
                const clerkUser = await clerkClient.users.getUser(userId);

                // Ensure unique username
                let baseUsername = clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split('@')[0];
                let uniqueUsername = baseUsername;
                let counter = 1;
                while (await User.findOne({ username: uniqueUsername })) {
                    uniqueUsername = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
                    counter++;
                }

                user = await User.create({
                    _id: userId,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    full_name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`,
                    username: uniqueUsername,
                    profile_picture: clerkUser.imageUrl,
                    connections: [],
                    followers: [],
                    following: []
                });
                
            } catch (clerkError) {
                 return res.json({ success: false, message: "User not found and sync failed: " + clerkError.message });
            }
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// update user data
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        let { username, bio, location, full_name } = req.body;

        const tempUser = await User.findById(userId);

        if (!username) username = tempUser.username;

        if (tempUser.username !== username) {
            const user = await User.findOne({ username });
            if (user) {
                // we will not change the username if it is already taken
                username = tempUser.username;
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name,
        };

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

        if (profile) {
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '512' },

                ]
            })
            updatedData.profile_picture = url;


        }

        if (cover) {
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname,
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' },

                ]
            })
            updatedData.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true })
        res.json({ success: true, user, message: 'profile updated successfully' })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// find users using username , email, location,name
// find users using username , email, location,name
export const discoverUsers = async (req, res) => {
    try {
        console.log("Discover Users Endpoint Hit. Body:", req.body);
        const { userId } = req.auth();
        const { input } = req.body;

        let query = {};
        if (input && input.trim() !== "") {
            query = {
                $or: [
                    { username: new RegExp(input, 'i') },
                    { email: new RegExp(input, 'i') },
                    { full_name: new RegExp(input, 'i') },
                    { location: new RegExp(input, 'i') },
                ]
            };
        }

        const allUsers = await User.find(query);
        const filteredUsers = allUsers.filter(user => user._id !== userId);
        
        console.log(`Found ${filteredUsers.length} users`);
        res.json({ success: true, users: filteredUsers })

    } catch (error) {
        console.log("Error in discoverUsers:", error);
        res.json({ success: false, message: error.message });
    }
};

//follow user

export const followUsers = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;
        const user = await User.findById(userId)
        if (user.following.includes(id)) {
            return res.json({ success: false, message: 'you are already following this user' })
        }

        user.following.push(id);
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers.push(userId)
        await toUser.save()

        res.json({ success: true, message: 'Now you are following this user' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//unfollow user
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;
        const user = await User.findById(userId)

        user.following = user.following.filter(user => user !== id);
        await user.save()

        const toUser = await User.findById(id)

        toUser.following = toUser.following.filter(user => user !== userId);
        await toUser.save()



        res.json({ success: true, message: 'Now you are following this user' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// send connection request
export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body;

        // check if user has sent more than 20 connection in the last 24 hour
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const connectionRequest = await Connection.find({ from_user_id: userId, createdAt: { $gt: last24Hours } })
        if (connectionRequest.length >= 20) {
            return res.json({ success: false, message: 'you have sent more than 20 connection requests in the last 24 hours' })
        }

        // check if users already connected
        const connection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId },

            ]
        })

        if (!connection) {
            const newConnection = await Connection.create({
                from_user_id: userId,
                to_user_id: id
            })

            await inngest.send({
                name: 'app/connection-request',
                data: { connectionId: newConnection._id }
            })


            return res.json({ success: true, message: 'Connection request sent successfully' })
        } else if (connection && connection.status === 'accepted') {
            return res.json({ success: false, message: 'You have sent more than 20 connection requests in the last 24 hours' })

        }
        return res.json({ success: false, message: 'Connection request pending' })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// get user connection
export const getUserConnections = async (req, res) => {
    try {
        const { userId } = req.auth();

        let user = await User.findById(userId).populate('connections followers following');

        if (!user) {
             // Self-healing: Sync from Clerk if missing
             try {
                const clerkUser = await clerkClient.users.getUser(userId);

                // Ensure unique username
                let baseUsername = clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split('@')[0];
                let uniqueUsername = baseUsername;
                while (await User.findOne({ username: uniqueUsername })) {
                    uniqueUsername = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
                }

                user = await User.create({
                    _id: userId,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    full_name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`,
                    username: uniqueUsername,
                    profile_picture: clerkUser.imageUrl,
                    connections: [],
                    followers: [],
                    following: []
                });
                // Since it's new, these are empty, but we match the structure
                user.connections = [];
                user.followers = [];
                user.following = [];
            } catch (clerkError) {
                 return res.json({ success: false, message: "User not found and sync failed: " + clerkError.message });
            }
        }

        const connections = user.connections || [];
        const followers = user.followers || [];
        const following = user.following || [];

        const pendingConnections = (await Connection.find({
            to_user_id: userId,
            status: 'pending',
        }).populate('from_user_id')).map((connection) => connection.from_user_id);

        res.json({
            success: true,
            connections,
            followers,
            following,
            pendingConnections,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Accept connection request
export const AcceptConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body;
        const connection = await Connection.findOne({ from_user_id: id, to_user_id: userId })

        if (!connection) {
            return res.json({ success: false, message: 'Connection not found' });
        }

        const user = await User.findById(userId);
        user.connections.push(id);
        await user.save()

        const toUser = await User.findById(id);
        toUser.connections.push(userId);
        await toUser.save()

        res.json({ success: true, message: 'Connection accepted successfully' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// get user profile

export const getUserProfiles = async (req, res) => {
    try {
        const { profileId } = req.body;
        const profile = await User.findById(profileId)
        if (!profile) {
            return res.json({ success: false, message: "Profile not found" });
        }

        const posts = await Post.find({ user: profileId }).populate('user')

        res.json({ success: true, profile, posts })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
