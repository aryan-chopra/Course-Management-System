import Group from "../models/group.js";

Group.createGroup = async (groupDoc) => {
    const group = new Group(groupDoc)

    await group.save()
}

export default Group
