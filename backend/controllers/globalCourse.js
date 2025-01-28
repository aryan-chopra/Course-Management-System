import { StatusCodes } from "http-status-codes";
import GlobalCourse from "../models/globalCourse.js";

GlobalCourse.createGlobalCourse = async (req, res) => {
    try {
        const globalCourseObject = {
            globalCourseID: req.body.id,
            name: req.body.name,
            semester: req.body.semester,
            coordinator: req.body.coordinator
        }

        const globalCourse = new GlobalCourse(globalCourseObject)

        await globalCourse.save()

        console.log("Course created")
        res.status(StatusCodes.OK).json({status: "OK"})
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
    }
}

GlobalCourse.getGlobalCourse = async (req, res) => {
    try {
        const courseID = req.params.id
    
        const course = await GlobalCourse.findOne({globalCourseID: courseID})

        if (course == null) {
            res.status(StatusCodes.NOT_FOUND).json({error: "No entity found"})
        }
        console.log(course)
        res.status(StatusCodes.OK).json({course: course})
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
    }
}

export default GlobalCourse
