import mongoose, { set } from "mongoose";
import Resource from "./resource.js";
import Teacher from "../services/teacher.js";
import Group from "./group.js";

/**
 * Schema for Course
 */

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        immutable: true
    },

    semester: {
        type: Number,
        required: true,
        immutable: true
    },

    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    }
},
    {
        collection: 'courses',
        minimize: false
    })

courseSchema.index({ semester: 1, courseName: 1 }, { unique: true })
courseSchema.index({ coordinator: 1 })


/** 
 * DELETE PRE/POST HOOKS
*/

//Hook to "deep delete" a course, i.e, delete the courses assigned to groups, and course's resources
courseSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    
    await Resource.deleteResourcesOfCourse(courseInfo.semester, this._id)
    
    const groups = await Group.getGroupsWithCourse(this.semester, this._id)
    
    console.log(groups)
    
    for (const groupInfo of groups) {
        const groupNumber = groupInfo.groupNumber
        
        await Group.removeCourse(this.semester, groupNumber, this.courseName)
    }
    
    next()
})


/**
 * SAVE PRE/POST HOOKS
 */

// Hook to replace coordinatorEmail with teacher Id
courseSchema.pre("save", async function (next) {
    if (!this.isNew && this.isModified("coordinator")) {
        this.coordinator = await Teacher.getId(this.coordinator)
    }

    next()
})


/**
 * UPDATE PRE/POST HOOKS
 */

courseSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
    if (this.getUpdate().coordinator) {
        this.getUpdate().coordinator = await Teacher.getId(this.getUpdate().coordinator)
    }

    next()
})


/**
 * Model for GlobalCourse
 */

const Course = mongoose.model('course', courseSchema)

export default Course
