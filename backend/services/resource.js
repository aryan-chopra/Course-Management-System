import { InvalidIdException } from "../exceptions/idException.js";
import Resource from "../models/resource.js";

Resource.createResource = async (resourceDoc) => {
    const resource = new Resource(resourceDoc)

    await resource.save()
}

Resource.readResourcesOfGroupForCourse = async (semester, group, course) => {
    const departmentCourses = await Resource.find({
        semester: semester,
        group: null,
        course: course
    })

    const groupCourses = await Resource.find({
        semester: semester,
        group: group,
        course: course
    })

    const allResources = departmentCourses.concat(groupCourses)

    return allResources
}

Resource.deleteResourcesOfCourse = async (semester, course) => {
    await Resource.deleteMany({
        semester: semester,
        course: course
    })
}

Resource.deleteResourcesOfGroup = async (semester, group) => {
    await Resource.deleteMany({
        semester: semester,
        group: group
    })
}

Resource.deleteResource = async (resourceId) => {
    const result = await Resource.deleteOne({
        _id: resourceId
    })

    if (result.deletedCount == 0) {
        throw InvalidIdException("resource")
    }
}

Resource.updateResource = async (resourceId, update) => {
    const resource = await Resource.findOneAndUpdate({
        _id: resourceId
    },
        update
    )

    if (resource == null) {
        throw InvalidIdException("resource")
    }

    return resource
}

export default Resource
