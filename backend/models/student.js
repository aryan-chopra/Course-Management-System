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
    }
},
    {
        collection: 'students'
    })

studentSchema.index({ rollnumber: 1 }, { unique: true })
studentSchema.index({ semester: 1, groupNumber: 1 })
studentSchema.index({ userId: 1 }, { unique: true })

studentSchema.pre('save', async function (next){
    await Group.checkExistance(this.semester, this.groupNumber)

    next()
})

const Student = mongoose.model('student', studentSchema)

export default Student
