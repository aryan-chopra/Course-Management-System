import Group from "../models/group.js";

Group.createGroup = async (groupDoc) => {
    const group = new Group(groupDoc)

    await group.save()
}

Group.readGroup = async (semester, number) => {
    const groupDoc = await Group.findOne({ semester: semester, groupNumber: number })

    return groupDoc
}

export default Group
