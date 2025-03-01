import { StatusCodes } from "http-status-codes";
// import GlobalCourse from "../models/globalCourse.js";
import { InvalidIdException } from "../exceptions/idException.js";

import GlobalCourse from "../services/globalCourse.js";

export const createGlobalCourse = async (req, res, next) => {
    try {
        const globalCourseObject = {
            globalCourseID: req.body.id,
            name: req.body.name,
            semester: req.body.semester,
            coordinator: req.body.coordinator,
            assignedToGroups: [...req.body.assignedToGroups]
        }
        console.log(req.body.groups)

        await GlobalCourse.createGlobalCourse(globalCourseObject)
        res.status(StatusCodes.OK).json({ status: "OK" })
    } catch (error) {
        next(error)
    }
}

export const readGlobalCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id

        const course = await GlobalCourse.readGlobalCourse(courseId)
        if (course == null) {
            throw new InvalidIdException("course")
        }

        console.log(course)
        res.status(StatusCodes.OK).json({ course: course })
    } catch (error) {
        next(error)
    }
}

export const updateGlobalCourse = async (req, res, next) => {
    try {
        const courseID = { globalCourseID: req.params.id }
        const update = req.body

        const doc = await GlobalCourse.updateGlobalCourse(courseID, update)

        if (doc == null) {
            throw new InvalidIdException("course")
        }

        console.log(doc)
        res.status(StatusCodes.OK).json({course: doc})
    } catch (error) {
        next(error)
    }
}

export const deleteGlobalCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id

        const result = await GlobalCourse.deleteGlobalCourse(courseId)
        if (result.deletedCount == 0) {
            throw new InvalidIdException("course")
        }

        res.status(StatusCodes.OK).send()
    } catch(error) {
        next(error)
    }
}

// // GlobalCourse.deleteGlobalCourse = async (req, res, next) => {
// //     try {
// //         console.log("Deleting " + req.params.id)
// //         const courseID = { globalCourseID: req.params.id }

// //         const result = await GlobalCourse.deleteOne(courseID)

// //         console.log(result.deletedCount)
// //         if (result.deletedCount == 0) {
// //             throw new InvalidIdException("course")
// //         }

// //         res.status(StatusCodes.OK).send()
// //     } catch (error) {
// //         next(error)
// //     }
// // }

// // export default GlobalCourse
