import mongoose, { set } from "mongoose";
import Group from "./group.js";
import Resource from "./resource.js";

/**
 * Schema for Course
 */

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    coordinator: {
        type: String,
        required: true
    }
},
    {
        collection: 'courses',
        minimize: false
    })

courseSchema.index({ semester: 1, courseName: 1 }, { unique: true })


/** 
  * DELETE PRE/POST HOOKS
  */

//Hook to "deep delete" a course, i.e, delete the courses assigned to groups, and course's resources
courseSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    await Resource.deleteResourcesOfCourse(this.semester, this.courseName)

    // TODO: Delete courses from groups
    next()
})

/**
 * Model for GlobalCourse
 */

const Course = mongoose.model('course', courseSchema)

export default Course
