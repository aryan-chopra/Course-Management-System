import mongoose, { mongo } from "mongoose";
import Resource from "../services/resource.js";
import Teacher from "../services/teacher.js";
import Course from "./course.js";

const groupSchema = new mongoose.Schema({
    groupNumber: {
        type: Number,
        required: [true, "Group number is required"],
        immutable: true
    },

    semester: {
        type: Number,
        required: [true, "Semester is required"],
        immutable: true
    },

    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: [true, "Mentor is required"]
    },

    courses: {
        type: [
            {
                _id: false,
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'course'
                },
                teacher: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'teacher'
                }
            }
        ]
    },

    _institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institute',
        required: [true, "Institute is required"]
    }
},
    {
        collection: 'groups',
        minimize: false,
        toJSON: {
            virtuals: true,

            transform: function (doc, ret) {
                delete ret.id
                delete ret._id
            }
        },
        toObject: {
            virtuals: true,

            transform: function (doc, ret) {
                delete ret._id
            }
        }
    })

groupSchema.index({ _institute: 1, semester: 1, groupNumber: 1 }, { unique: true })
groupSchema.index({ _institute: 1, "courses.teacher": 1 })
groupSchema.index({ _institute: 1, semester: 1, "courses.course": 1 })

// Virtual to populate students of a group
groupSchema.virtual('students', {
    ref: 'student',
    localField: ["semester", "groupNumber"],
    foreignField: ["semester", "groupNumber"]
})


/**
 * DELETE PRE/POST HOOKS
 */

//Hook to remove group resources
groupSchema.post('deleteOne', { document: true, query: false }, async function (doc, next) {
    //Deleting resources
    await Resource.deleteResourcesOfGroup(this.semester, this.groupNumber)

    next()
})


/**
 * SAVE PRE/POST HOOKS
 */

// Hook to replace teacher e-mail with teacher id before saving old doc
groupSchema.pre('save', async function (next) {
    if (!this.isNew && this.isModified("mentor")) {
        this.mentor = await Teacher.getId(this.mentor)
    }

    next()
})

// Hook to simplify 11000 error in mongodb
groupSchema.post('save', (error, doc, next) => {
    if (error.name == 'MongoServerError' && error.code == 11000) {
        next(new Error('Semester can not have multiple groups with same number'))
    } else {
        next()
    }
})


/**
 * UPDATE PRE/POST HOOKS
 */

// Hook to replace mentor e-mail with Id in case of update operations
groupSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
    if (this.getUpdate().mentor !== undefined) {
        this.getUpdate().mentor = await Teacher.getId(this.getUpdate().mentor)
    }

    next()
})

// Hook to replace courseName and teacherEmail with object Ids for push operation
groupSchema.pre('updateOne', async function (next) {
    if (this.getUpdate().$push !== undefined) {
        //Adding a new course
        const semester = Number(this.getQuery().semester)
        const teacherEmail = this.getUpdate().$push.courses.teacherEmail
        const courseName = this.getUpdate().$push.courses.courseName

        const courseId = await Course.getId(semester, courseName)
        const teacherId = await Teacher.getId(teacherEmail)

        delete this.getUpdate().$push.courses.teacherEmail
        this.getUpdate().$push.courses.teacher = teacherId

        delete this.getUpdate().$push.courses.courseName
        this.getUpdate().$push.courses.course = courseId
    }

    next()
})

// Hook to replace courseName and teaherEmail with objectIds for pull operation
groupSchema.pre('updateOne', async function (next) {
    if (this.getUpdate().$pull !== undefined) {
        //Removing an old course
        const semester = Number(this.getQuery().semester)
        const courseName = this.getUpdate().$pull.courses.courseName

        const courseId = await Course.getId(semester, courseName)

        this.getUpdate().$pull.courses.course = courseId
        delete this.getUpdate().$pull.courses.courseName
    }

    next()
})

// Hook to replace teacherEmail and courseName with object Ids
groupSchema.pre('updateOne', async function (next) {
    if (this.getUpdate().$set !== undefined) {
        const semester = Number(this.getQuery().semester)
        const courseName = this.getQuery()["courses.courseName"]
        const teacherEmail = this.getUpdate().$set["courses.$.teacherEmail"]

        const courseId = await Course.getId(semester, courseName)
        const teacherId = await Teacher.getId(teacherEmail)

        this.getQuery()["courses.course"] = courseId
        delete this.getQuery()["courses.courseName"]

        this.getUpdate().$set["courses.$.teacher"] = teacherId
        delete this.getUpdate().$set["courses.$.teacherEmail"]
    }

    next()
})

const Group = mongoose.model('group', groupSchema)

export default Group
