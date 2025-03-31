import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an e-mail"],
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: "Please provide a valid e-mail address"
        }
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
        collection: 'users'
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

userSchema.index({ email: 1 }, { unique: true })

const User = mongoose.model('user', userSchema)

export default User
