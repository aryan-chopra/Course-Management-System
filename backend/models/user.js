import mongoose from "mongoose";
import Student from "../services/student.js";
import Teacher from "../services/teacher.js";
import Admin from "./admin.js";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an e-mail"],
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            },
            message: "Please provide a valid e-mail address"
        },
        index: true,
        unique: [true, "E-mail already in use"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: function (password) {
                return password.length >= 8
            },
            message: "Length of password must be atleast 8 characters long"
        }
    },

    role: {
        type: String,
        required: [true, "Please specify a role"],
        immutable: true,
        enum: ['student', 'teacher', 'admin']
    },
},
    {
        collection: 'users',
        toJSON: {
            virtuals: true,

            transform: function(doc, ret) {
                delete ret._id
            }
        },
        toObject: { virtuals: true },
        id: false
    })

userSchema.virtual('userInfo', {
    ref: function (doc) {
        if (doc.role == 'admin') {
            return ''
        } else {
            return doc.role
        }
    },
    localField: function (doc) {
        if (doc.role == 'admin') {
            return ''
        } else {
            return doc._id
        }
    },
    foreignField: function (doc) {
        if (doc.role == 'admin') {
            return ''
        } else {
            return 'userId'
        }
    }
})

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    if (this.role === 'student') {
        await Student.deleteStudent(this._id)
    } else if (this.role === 'teacher') {
        await Teacher.deleteTeacher(this._id)
    } else if (this.role === 'admin') {
        await Admin.deleteAdmin(this._id)
    }

    next()
})

const User = mongoose.model('user', userSchema)

export default User
