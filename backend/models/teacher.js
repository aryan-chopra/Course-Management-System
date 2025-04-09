import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "User ID is required"],
    },

    name: {
        type: String,
        required: [true, "Please provide a name"],
    },

    _institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'institute',
        required: [true, "Institute is required"]
    }
},
    {
        collection: 'teachers',
        minimize: false,
        toJSON: {
            virtuals: true,

            transform: function (doc, ret) {
                delete ret._id
                delete ret.__v
                delete ret.userId
            }
        },
        toObject: { virtuals: true },
        id: false
    })

teacherSchema.index({ userId: 1 }, { unique: true })

teacherSchema.virtual('info', {
    ref: 'user',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
    options: {
        select: 'email'
    }
})

const Teacher = mongoose.model('teacher', teacherSchema)

export default Teacher
