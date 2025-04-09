import mongoose from "mongoose";
import Group from "./group.js";

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "Please provide a userId"]
    },

    rollnumber: {
        type: Number,
        required: [true, "Roll number is required"],
        immutable: true
    },

    name: {
        type: String,
        required: [true, "Student name is required"],
    },

    semester: {
        type: Number,
        required: [true, "Student must have a semester"]
    },

    groupNumber: {
        type: Number,
        required: [true, "Student must have a group"]
    },

    _institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institute',
        required: [true, "Institute is required"],
        immutable: true
    }
},
    {
        collection: 'students'
    })


/**
 * Indexes
 */

studentSchema.index({ _institute: 1, rollnumber: 1 }, { unique: true })
studentSchema.index({ _institute: 1, semester: 1, groupNumber: 1 })
studentSchema.index({ userId: 1 }, { unique: true })


/**
 * Virtuals
 */

studentSchema.virtual('info', {
    ref: 'user',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
    options: {
        select: 'email'
    }
})


/**
 * PRE/POST Save hooks
 */

studentSchema.pre('save', async function (next){
    await Group.checkExistance(this._institute, this.semester, this.groupNumber)

    next()
})

const Student = mongoose.model('student', studentSchema)

export default Student
