import mongoose, { mongo } from "mongoose";

const adminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, "Please provide user ID"],
        index: true
    },

    name: {
        type: String,
        required: [true, "Please provide admin name"]
    }
},
    {
        collection: 'users'
    })

const User = mongoose.model("admin", adminSchema)

export default User
