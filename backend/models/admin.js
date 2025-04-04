import mongoose, { mongo } from "mongoose";

const adminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, "Please provide user ID"]
    },

    name: {
        type: String,
        required: [true, "Please provide admin name"]
    }
},
    {
        collection: 'admins'
    })


/**
 * Indexes
 */

adminSchema.index({ userId: 1 })


/**
 * Virtuals
 */

adminSchema.virtual('info', {
    ref: 'user',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
    options: {
        select: 'email'
    }
})


const Admin = mongoose.model("admin", adminSchema)

export default Admin
