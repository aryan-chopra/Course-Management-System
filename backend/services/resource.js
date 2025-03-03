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

export default Resource
