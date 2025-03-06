import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },

    email: {
        type: String,
        required: [true, "Please provide an e-mail"],
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
        unique: [true, "E-mail already in use"],
        index: true
    },

    assignedGroups: {
        type: [{
            semester: Number,
            groupNumber: Number,
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

const Teacher = mongoose.model('teacher', teacherSchema)

export default Teacher
