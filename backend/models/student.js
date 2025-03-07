import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    rollnumber: {
        type: Number,
        required: [true, "Roll number is required"],
        unique: [true, "Roll number must be unique"],
        index: true,
        immutable: true
    },

    name: {
        type: String,
        required: [true, "Student name is required"],
    },

    group: {
        type: Number,
    },

    semester: {
        type: Number,
        required: [true, "Student must have a semester"]
    }
},
    {
        collection: 'students'
    })

studentSchema.index({ semester: 1, group: 1 }, { unique: true })

const Student = mongoose.model('student', studentSchema)

export default Student
