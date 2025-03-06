/**
 * Schema for resource
 */

import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true
    },

    course: {
        type: String,
        required: true
    },

    group: {
        type: Number,
        default: null
    },

    author: {
        type: String,
        required: true
    },

    authorDesignation: {
        type: String,
        required: true
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
