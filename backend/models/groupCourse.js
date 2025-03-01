import mongoose from "mongoose";

const groupCourseSchema = new mongoose.Schema({
    groupCourseID: {
        type: String,
        required: [true, "Provide an ID"],
        unique: [true, "ID already exists"],
        index: true
    },
    parentCourseID: {
        type: String,
        required: [true, "Provide a parent ID"]
    },
    name: String,
    teacher: {
        type: String,
        required: true
    }
},
    {
        collection: 'groupCourses',
        minimize: false
    })

const GroupCourse = new mongoose.model('groupCourse', groupCourseSchema)

export default GroupCourse
