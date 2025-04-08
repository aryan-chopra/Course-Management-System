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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course', 
        required: true,
        immutable: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'authorType',
        required: true,
        immutable: true
    },

    authorType: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
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

    _institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institute',
        required: [true, "Institute is required"]
    }
},
    {
        collection: "resources",
        minimize: false
    })

resourceSchema.index({ _institute: 1, semester: 1, group: 1, course: 1 })

const Resource = mongoose.model("resource", resourceSchema)

export default Resource
