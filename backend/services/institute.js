import { UnauthorisedException } from "../exceptions/unauthorisedException.js";
import Institute from "../models/institute.js";
import User from "./user.js";

Institute.createInstitute = async (name, adminInfo) => {
    const instituteDoc = {
        name: name
    }

    const institute = new Institute(instituteDoc)
    await institute.save()

    try {
        await User.createFirstUserAndAdmin(adminInfo)
    } catch (error) {
        await institute.deleteOne()
        throw error
    }
}

Institute.getId = async (name) => {
    const institute = await Institute.findOne(
        {
            name: name
        },
        {
            _id: 1
        }
    )

    if (!institute) {
        throw new UnauthorisedException()
    }

    return institute._id.toHexString()
}

Institute.getName = async (id) => {
    const institute = await Institute.findone(
        {
            _id: id
        },
        {
            name: 1
        }
    )

    if (!institute) {
        throw new UnauthorisedException()
    }

    return institute.name
}

export default Institute
