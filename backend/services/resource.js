import { InvalidIdException } from "../exceptions/idException.js";
import Resource from "../models/resource.js";
import User from "../models/user.js";
import Course from "./course.js";

Resource.createResource = async (resourceDoc) => {
    resourceDoc.course = await Course.getId(resourceDoc.semester, resourceDoc.course)
    resourceDoc.author = await User.getId(resourceDoc.author)

    const resource = new Resource(resourceDoc)

    await resource.save()

    return resource
}

Resource.readDepartmentResources = async (institute, semester, course) => {
    const departmentResources = await Resource.find({
        _institute: institute,
        semester: semester,
        group: null,
        course: course
    })

    return departmentResources
}

Resource.readResourcesOfGroupForCourse = async (institute, semester, group, course) => {
    const departmentResources = await Resource.readDepartmentResources(semester, course)

    const groupResources = await Resource.find({
        _institute: institute,
        semester: semester,
        group: group,
        course: course
    })
    .populate()

    const allResources = departmentResources.concat(groupResources)

    return allResources
}

Resource.deleteResourcesOfCourse = async (institute, semester, course) => {
    await Resource.deleteMany({
        _institute: institute,
        semester: semester,
        course: course
    })
}

Resource.deleteResourcesOfGroup = async (institute, semester, group) => {
    await Resource.deleteMany({
        _institute: institute,
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

    if (!resource) {
        throw InvalidIdException("resource")
    }

    return resource
}

export default Resource
