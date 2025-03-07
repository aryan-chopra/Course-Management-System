import mongoose, { mongo } from "mongoose";
import Resource from "../services/resource.js";
import Teacher from "../services/teacher.js";

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
        type: String,
        required: [true, "Mentor is required"]
    },

    courses: {
        type: [{
            courseName: String,
            teacherEmail: String
        }]
    }
},
    {
        collection: 'groups',
        minimize: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

groupSchema.index({ semester: 1, groupNumber: 1 }, { unique: true })


// Virtual to populate students of a group

groupSchema.virtual('students', {
    ref: 'student',
    localField: ["semester", "groupNumber"],
    foreignField: ["semester", "group"]
    // match: (student) => ({ semester: student.semester })
})



/**
 * DELETE PRE/POST HOOKS
 */

//Hook to remove mentor and group resources
groupSchema.post('deleteOne', { document: true, query: false }, async function (doc, next) {
    const groupInfo = {
        semester: this.semester,
        groupNumber: this.groupNumber
    }

    //Removing mentor
    await Teacher.removeMentorForGroup(this.mentor, groupInfo)

    //Deleting resources
    await Resource.deleteResourcesOfGroup(this.semester, this.groupNumber)

    //Removing course from teacher
    for (const courseInfo of this.courses) {
        const courseDoc = {
            semester: this.semester,
            groupNumber: this.groupNumber,
            courseName: courseInfo.courseName
        }

        const teacherEmail = courseInfo.teacherEmail

        await Teacher.removeCourse(teacherEmail, courseDoc)
    }

    next()
})


/**
 * FIND/FINDONE PRE/POST HOOKS
 */

//Hook to populate students
groupSchema.pre(["find", "findOne"], function (next) {
    this.populate('students')
    next()
})


/**
 * SAVE PRE/POST HOOKS
 */

//Hook to assign mentor
groupSchema.post('save', async function (doc, next) {
    const groupInfo = {
        semester: doc.semester,
        groupNumber: doc.groupNumber
    }

    await Teacher.addMentorForGroup(doc.mentor, groupInfo)
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

//Assign course to teacher in case of a push operation to courses
groupSchema.pre('updateOne', async function (next) {
    if (this.getUpdate().$push !== undefined) {
        console.log("In push")

        //Adding a new course
        const semester = Number(this.getQuery().semester)
        const groupNumber = Number(this.getQuery().groupNumber)
        const teacherEmail = this.getUpdate().$push.courses.teacherEmail
        const courseName = this.getUpdate().$push.courses.courseName

        const courseInfo = {
            semester: semester,
            groupNumber: groupNumber,
            courseName: courseName
        }

        await Teacher.assignCourse(teacherEmail, courseInfo)
    }

    next()
})

//Remove course from teacher in case of a pull operation
groupSchema.pre('updateOne', async function (next) {
    if (this.getUpdate().$pull !== undefined) {
        //Removing an old course
        const semester = Number(this.getQuery().semester)
        const groupNumber = Number(this.getQuery().groupNumber)
        const courseName = this.getUpdate().$pull.courses.courseName

        const teacherInfo = await this.model.aggregate([
            {
                $match: {
                    semester: semester,
                    groupNumber: groupNumber
                }
            },
            {
                $unwind: "$courses"
            },
            {
                $match: {
                    "courses.courseName": courseName
                }
            },
            {
                $project: {
                    teacherEmail: "$courses.teacherEmail"
                }
            },
            {
                $unset: "_id"
            }
        ])

        const teacherEmail = teacherInfo[0].teacherEmail
        const courseInfo = {
            semester: semester,
            groupNumber: groupNumber,
            courseName: courseName
        }

        await Teacher.removeCourse(teacherEmail, courseInfo)
    }

    next()
})

//Remove course access from old teacher, and add course to new teacher 
groupSchema.pre('updateOne', async function (next) {
    if (this.getUpdate().$set !== undefined) {
        const semester = Number(this.getQuery().semester)
        const groupNumber = Number(this.getQuery().groupNumber)
        const courseName = this.getQuery()["courses.courseName"]
        const newTeacherEmail = this.getUpdate().$set["courses.$.teacherEmail"]

        const oldInfo = await this.model.aggregate([
            {
                $match: {
                    semester: semester,
                    groupNumber: groupNumber
                }
            },
            {
                $unwind: "$courses"
            },
            {
                $match: {
                    "courses.courseName": courseName
                }
            },
            {
                $project: {
                    teacherEmail: "$courses.teacherEmail"
                }
            },
            {
                $unset: "_id"
            }
        ])

        const oldTeacherEmail = oldInfo[0].teacherEmail

        const courseInfo = {
            semester: semester,
            groupNumber: groupNumber,
            courseName: courseName
        }

        await Teacher.removeCourse(oldTeacherEmail, courseInfo)
        await Teacher.assignCourse(newTeacherEmail, courseInfo)
    }

    next()
})

const Group = mongoose.model('group', groupSchema)

export default Group
