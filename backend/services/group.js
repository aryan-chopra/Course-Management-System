import { InvalidIdException } from "../exceptions/idException.js";
import Group from "../models/group.js";

Group.createGroup = async (groupDoc) => {
    const group = new Group(groupDoc)

    await group.save()
}

Group.readGroup = async (semester, number) => {
    const groupDoc = await Group.findOne({ semester: semester, groupNumber: number })

    if (groupDoc == null) {
        throw new InvalidIdException("group")
    }

    return groupDoc
}

Group.updateGroup = async (semester, number, update) => {
    const groupDoc = await Group.findOneAndUpdate({ semester: semester, groupNumber: number }, update, {
        runValidators: true,
        returnDocument: "after"
    })

    if (groupDoc == null) {
        throw new InvalidIdException("group")
    }

    return groupDoc
}

Group.deleteGroup = async (semester, number) => {
    const result = await Group.deleteOne({semester: semester, groupNumber: number})

    if (result.deletedCount == 0) {
        throw new InvalidIdException("group")
    }
}

export default Group
