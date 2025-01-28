import mongoose from "mongoose";

const globalCourseSchema = new mongoose.Schema({
    globalCourseID: {
        type: String,
        required: [true, 'GIMME AN ID!'],
        unique: [true, "ID already exists"],
        index: true
    },
    name: {type: String, required: true},
    semester: {type: Number, required: true},
    assignedToGroups: [Number],
    coordinator: {type: String, required: true}
},
    {
        collection: 'globalCourses',
        minimize: false
    })

const GlobalCourse = mongoose.model('globalCourse', globalCourseSchema)

export default GlobalCourse
