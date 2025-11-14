// model/story.js

import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
    // User ID is of type String, matching your models/user.js definition
    // model/story.js
    user: { type: String, ref: 'User', required: true },
    content: { type: String },
    // FIX: Changed from an array ([{ type: String }]) to a single string { type: String }
    media_url: { type: String },
    media_type: { type: String, enum: ['text', 'image', 'video'] },
    views_count: [{ type: String, ref: 'User' }],
    background_color: { type: String },
}, { timestamps: true, minimize: false })

const Story = mongoose.model('Story', storySchema)

export default Story;