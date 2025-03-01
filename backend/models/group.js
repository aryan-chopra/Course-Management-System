import mongoose, { mongo } from "mongoose";

const groupSchema = new mongoose.Schema({
    groupNumber: { type: Number, required: [true, "Group number is required"] },
    semester: { type: Number, required: [true, "Semester is required"] },
    mentor: { type: String, required: [true, "Mentor is required"] },
    students: [String],
    courses: [String]
},
    {
        collection: 'groups',
        minimize: false
    })

groupSchema.index({ semester: 1, groupNumber: 1 }, { unique: true })

groupSchema.post('save', (error, doc, next) => {
    if (error.name == 'MongoServerError' && error.code == 11000) {
        next(new Error('Semester can not have multiple groups with same number'))
    } else {
        next()
    }
})

const Group = mongoose.model('group', groupSchema)

export default Group
