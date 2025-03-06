import mongoose, { mongo } from "mongoose";
import Resource from "../services/resource.js";

const groupSchema = new mongoose.Schema({
    groupNumber: { type: Number, required: [true, "Group number is required"] },
    semester: { type: Number, required: [true, "Semester is required"] },
    mentor: { type: String, required: [true, "Mentor is required"] },
    courses: {
        type: [String],
    }
},
    {
        collection: 'groups',
        minimize: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

groupSchema.index({ semester: 1, groupNumber: 1 }, { unique: true })

groupSchema.virtual('students', {
    ref: 'student',
    localField: ["semester", "groupNumber"],
    foreignField: ["semester", "group"]
    // match: (student) => ({ semester: student.semester })
})


/**
 * FIND/FINDONE PRE/POST HOOKS
 */

groupSchema.pre(["find", "findOne"], function (next) {
    this.populate('students')
    next()
})


/**
 * DELETE PRE/POST HOOKS
 */

// Hook to "deep delete" group, i.e, delete all it's resources
groupSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    await Resource.deleteResourcesOfGroup(this.semester, this.groupNumber)

    next()
})


/**
 * SAVE PRE/POST HOOKS
 */

// Hook to simplify 11000 error in mongodb
groupSchema.post('save', (error, doc, next) => {
    if (error.name == 'MongoServerError' && error.code == 11000) {
        next(new Error('Semester can not have multiple groups with same number'))
    } else {
        next()
    }
})

const Group = mongoose.model('group', groupSchema)

export default Group
