import mongoose from "mongoose";

const groupCourseSchema = new mongoose.Schema({
    teacher: {
        type: String,
        required: [true, "Please provide a teacher"]
    },
    semester: {
        type: Number,
        required: [true, "Please provide a semester"]
    },
    groupNumber: {
        type: Number,
        required: [true, "Please provide a group"]
    },
    parentCourseId: {
        type: String,
        required: [true, "Provide a parent ID"]
    }
},
    {
        collection: 'groupCourses',
        minimize: false
    })

groupCourseSchema.index({semester: 1, groupNumber: 1, parentCourseId: -1}, {unique: true})

groupCourseSchema.post('save', async function(error, doc, next) {
    if (error.name == 'MongoServerError' && error.code == 11000) {
        console.log(error)
        next(new Error("Course" + this + " \nfor this semester and group number already exists"))
    } else {
        next()
    }
})

const GroupCourse = new mongoose.model('groupCourse', groupCourseSchema)

export default GroupCourse
