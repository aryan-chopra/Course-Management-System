import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID is required"],
    },

    name: {
        type: String,
        required: [true, "Please provide a name"],
    }
},
    {
        collection: 'teachers',
        minimize: false
    })

teacherSchema.index({ userId: 1 }, { unique: true })

const Teacher = mongoose.model('teacher', teacherSchema)

export default Teacher
