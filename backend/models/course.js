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
        required: true
        // immutable: true
    },

    semester: {
        type: Number,
        required: true,
        immutable: true
    },

    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },

    _institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institute',
        required: [true, "Institute is required"],
        immutable: true
    }
},
    {
        collection: 'courses',
        minimize: false,
        toJSON: {
            transform: function(doc, ret) {
                delete ret._id
                delete ret.id
            }
        }
    })

courseSchema.index({ _institute: 1, semester: 1, courseName: 1 }, { unique: true })
courseSchema.index({ _institute: 1, coordinator: 1 })


/** 
 * DELETE PRE/POST HOOKS
*/

//Hook to "deep delete" a course, i.e, delete the courses assigned to groups, and course's resources
courseSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    
    await Resource.deleteResourcesOfCourse(this._institute, this.semester, this._id)
    
    const groups = await Group.getGroupsWithCourse(this._institute, this.semester, this._id.toHexString())
    
    console.log(groups)
    
    for (const groupInfo of groups) {
        const groupNumber = groupInfo.groupNumber
        
        await Group.removeCourse(this._institute, this.semester, groupNumber, this.courseName)
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
    console.log("Updating")

    console.log(this.getUpdate())

    if (this.getUpdate().coordinator) {
        this.getUpdate().coordinator = await Teacher.getId(this.getUpdate().coordinator)
        console.log(this.getUpdate())
    }

    next()
})


/**
 * Model for GlobalCourse
 */

const Course = mongoose.model('course', courseSchema)

export default Course
