import { StatusCodes } from "http-status-codes";
import GlobalCourse from "../models/globalCourse.js";
import { InvalidIdException } from "../exceptions/idException.js";

GlobalCourse.createGlobalCourse = async (req, res, next) => {
    try {
        const globalCourseObject = {
            globalCourseID: req.body.id,
            name: req.body.name,
            semester: req.body.semester,
            coordinator: req.body.coordinator,
            assignedToGroups: [...req.body.assignedToGroups]
        }
        console.log(req.body.groups)

        const globalCourse = new GlobalCourse(globalCourseObject)

        await globalCourse.save()

        console.log("Course created")
        res.status(StatusCodes.OK).json({status: "OK"})
    } catch (error) {
        next(error)
    }
}

GlobalCourse.readGlobalCourse = async (req, res, next) => {
    try {
        const courseID = req.params.id
    
        const course = await GlobalCourse.findOne({globalCourseID: courseID})

        if (course == null) {
            throw new InvalidIdException("course")
        }

        console.log(course)
        res.status(StatusCodes.OK).json({course: course})
    } catch (error) {
        next(error)
    }
}

GlobalCourse.updateGlobalCourse = async (req, res, next) => {
    try {
        const courseId = {globalCourseID: req.params.id}
        const course = await GlobalCourse.findOne(courseId)
        if (course == null) {
            throw new InvalidIdException("course")
        }
        
        const update = req.body

        const updatedCourse = await GlobalCourse.updateOne(courseId, update)

        console.log(updatedCourse)
        res.status(StatusCodes.OK).json({course: updatedCourse})
    } catch (error) {
        next(error)
    }
}

GlobalCourse.deleteGlobalCourse = async (req, res, next) => {
    try {
        const courseID = {globalCourseID: req.params.id}
        const course = await GlobalCourse.findOne(courseID)

        if (course == null) {
            throw new InvalidIdException("course")
        }

        const result = await GlobalCourse.deleteOne(courseID)

        res.status(StatusCodes.OK).send()
    } catch (error) {
        next(error)
    }
}

export default GlobalCourse
