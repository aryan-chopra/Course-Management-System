/**
 * Schema for resource
 */

import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true,
        immutable: true
    },

    group: {
        type: Number,
        default: null,
        immutable: true
    },

    course: {
        type: String,
        required: true,
        immutable: true
    },

    author: {
        type: String,
        required: true,
        immutable: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: "No description provided..."
    },
    
    content: {
        type: String,
        required: true
    },
},
    {
        collection: "resources",
        minimize: false
    })

resourceSchema.index({ semester: 1, group: 1, course: 1 })

const Resource = mongoose.model("resource", resourceSchema)

export default Resource
