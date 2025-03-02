import mongoose, { set } from "mongoose";
import GroupCourse from "../services/groupCourse.js";
import Group from "./group.js";
import { InvalidEntityException } from "../exceptions/entityException.js";

/**
 * Schema for GlobalCourse
 */

const globalCourseSchema = new mongoose.Schema({
    globalCourseId: {
        type: String,
        required: [true, 'GIMME AN ID!'],
        unique: [true, "globalCourseId already exists"],
        index: true
    },
    name: { type: String, required: true },
    semester: { type: Number, required: true },
    assignedToGroups: {
        type: [Number],
        set: function (assignedToGroups) {
            this._previousGroups = this.assignedToGroups
            return assignedToGroups
        }
    },
    resources: [String],
    coordinator: { type: String, required: true }
},
    {
        collection: 'globalCourses',
        minimize: false
    })


/** 
  * DELETE PRE/POST HOOKS
  */

//Hook to "deep delete" a course, i.e, delete the sub courses contained in it
globalCourseSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    console.log("Deleting a doc")

    for (const groupNumber of this.assignedToGroups) {
        await GroupCourse.deleteCourse(this.semester, groupNumber, this.globalCourseId)
    }

    next()
})


/**
 * SAVE PRE/POST HOOKS
 */

// Hook to check if the document is a new document
globalCourseSchema.pre("save", function (next) {
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
globalCourseSchema.pre("save", async function (next) {
    for (const groupNumber of this._createGroupCourses) {
        await Group.readGroup(this.semester, groupNumber)
    }

    next()
})

// Hook to create new GroupCourses
globalCourseSchema.pre("save", async function (next) {
    this._groupsCreated = []

    try {

        //Create all the group-courses to create
        for (const groupNumber of this._createGroupCourses) {
            const course = {
                teacher: this.coordinator,
                groupNumber: groupNumber,
                semester: this.semester,
                parentCourseId: this.globalCourseId,
            }

            await GroupCourse.createCourse(course)
            this._groupsCreated.push(groupNumber)
        }
    } catch (error) {

        // Delete created courses if an error occurs
        for (const groupNumber of this._groupsCreated) {
            await GroupCourse.deleteCourse(this.semester, groupNumber, this.globalCourseId)
        }

        next(error)
    }

    next()
})

// Hook to delete group-courses to delete
globalCourseSchema.post("save", async function (doc, next) {
    for (const groupNumber of this._deleteGroupCourses) {
        await GroupCourse.deleteCourse(doc.semester, groupNumber, doc.globalCourseId)
    }
})

// Hook to delete created group-courses in case of an error
globalCourseSchema.post("save", async function (error, doc, next) {
    for (const groupNumber of this._groupsCreated) {
        await GroupCourse.deleteCourse(doc.semester, groupNumber, doc.globalCourseId)
    }

    next()
})

/**
 * Model for GlobalCourse
 */

const GlobalCourse = mongoose.model('globalCourse', globalCourseSchema)

export default GlobalCourse
