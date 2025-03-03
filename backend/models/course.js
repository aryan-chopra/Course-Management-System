import mongoose, { set } from "mongoose";
import Group from "./group.js";

/**
 * Schema for Course
 */

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    semester: { type: Number, required: true },
    assignedToGroups: {
        type: [Number],
        set: function (assignedToGroups) {
            this._previousGroups = this.assignedToGroups
            return assignedToGroups
        }
    },
    coordinator: { type: String, required: true }
},
    {
        collection: 'courses',
        minimize: false
    })

courseSchema.index({ semester: 1, courseName: 1 }, { unique: true })


/** 
  * DELETE PRE/POST HOOKS
  */

//Hook to "deep delete" a course, i.e, delete the sub courses contained in it
courseSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    console.log("Deleting a doc")

    for (const groupNumber of this.assignedToGroups) {
        await Group.deleteCourse(this.semester, groupNumber, this.courseName)
    }

    next()
})


/**
 * SAVE PRE/POST HOOKS
 */

// Hook to check if the document is a new document
courseSchema.pre("save", function (next) {
    this._wasNew = this.isNew

    if (this.isNew == true) {
        // Create all group-courses of a new course, delete none

        this._createGroupCourses = this.assignedToGroups
        this._deleteGroupCourses = []
    } else if (this.isModified("assignedToGroups") == true) {
        // Course is modified, populate group-courses to create and delete

        console.log("Prev: " + this._previousGroups)
        console.log("New: " + this.assignedToGroups)

        this._deleteGroupCourses = this._previousGroups.filter(
            (group) => this.assignedToGroups.indexOf(group) === -1
        )
        this._createGroupCourses = this.assignedToGroups.filter(
            (group) => this._previousGroups.indexOf(group) === -1
        )
    } else {
        // Course is modified, but it's groups are not

        this._createGroupCourses = []
        this._deleteGroupCourses = []
    }

    next()
})

// Hook to verify if the groups exist
courseSchema.pre("save", async function (next) {
    for (const groupNumber of this._createGroupCourses) {
        await Group.readGroup(this.semester, groupNumber)
    }

    next()
})

// Hook to create new GroupCourses
courseSchema.post("save", async function (doc, next) {
    doc._groupsAssigned = []

    try {

        //Create all the group-courses to create
        for (const groupNumber of doc._createGroupCourses) {
            await Group.addCourse(doc.semester, groupNumber, doc.courseName)
            doc._groupsAssigned.push(groupNumber)
        }
    } catch (error) {

        // Delete created courses if an error occurs
        for (const groupNumber of this._groupsAssigned) {
            await Group.deleteCourse(doc.semester, groupNumber, doc.courseName)
        }

        next(error)
    }

    next()
})

// Hook to delete group-courses to delete
courseSchema.post("save", async function (doc, next) {
    for (const groupNumber of this._deleteGroupCourses) {
        await Group.deleteCourse(doc.semester, groupNumber, doc.courseName)
    }
})

// Hook to delete created group-courses in case of an error
// courseSchema.post("save", async function (error, doc, next) {
//     for (const groupNumber of this._groupsAssigned) {
//         await Group.deleteCourse(doc.semester, groupNumber, doc.courseName)
//     }

//     next()
// })

/**
 * Model for GlobalCourse
 */

const Course = mongoose.model('course', courseSchema)

export default Course
