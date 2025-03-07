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
 * SAVE PRE/POST HOOKS
 */

courseSchema.pre("save", async function (next) {
    this._wasNew = this.isNew

    next()
})

courseSchema.post("save", async function (doc, next) {
    if (this._wasNew) {
        const courseInfo = {
            semester: doc.semester,
            courseName: doc.courseName
        }

        await Teacher.addCoordinatorForCourse(doc.coordinator, courseInfo)
    }

    next()
})


/** 
  * DELETE PRE/POST HOOKS
  */

//Hook to "deep delete" a course, i.e, delete the courses assigned to groups, and course's resources
courseSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    const courseInfo = {
        semester: this.semester,
        courseName: this.courseName
    }

    await Teacher.removeCoordinatorForCourse(this.coordinator, courseInfo)
    await Resource.deleteResourcesOfCourse(courseInfo.semester, courseInfo.courseName)

    const groups = await Group.getGroupsWithCourse(this.semester, this.courseName)

    console.log(groups)

    for (const groupInfo of groups) {
        const groupNumber = groupInfo.groupNumber

        await Group.removeCourse(this.semester, groupNumber, this.courseName)
    }

    next()
})

/**
 * Model for GlobalCourse
 */

const Course = mongoose.model('course', courseSchema)

export default Course
