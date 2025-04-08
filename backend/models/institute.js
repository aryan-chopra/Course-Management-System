import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Institute name is required"]
    }
},
{
    collection: 'institutes'
})

const Institute = new mongoose.model('institute', instituteSchema)

export default Institute
