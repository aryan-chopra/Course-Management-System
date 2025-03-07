import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },

    teacherEmail: {
        type: String,
        required: [true, "Please provide an e-mail"],
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },

    assignedCourses: {
        type: [{
            semester: Number,
            groupNumber: Number,
            courseName: String
        }],
        default: []
    },

    coordinatorOf: {
        type: [{
            semester: Number,
            courseName: String
        }],
        default: []
    },

    mentorOf: {
        type: [{
            semester: Number,
            groupNumber: Number
        }],
        default: []
    }
},
    {
        collection: 'teachers',
        minimize: false
    })

teacherSchema.index({teacherEmail: 1}, {unique: true})

const Teacher = mongoose.model('teacher', teacherSchema)

export default Teacher
