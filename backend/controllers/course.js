import { StatusCodes } from "http-status-codes";
import Course from "../services/course.js";

export const createCourse = async (req, res, next) => {
    try {
        const courseObject = req.body
        console.log(req.body.groups)

        await Course.createCourse(courseObject)
        res.status(StatusCodes.OK).json({ status: "OK" })
    } catch (error) {
        next(error)
    }
}

export const readCourse = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const name = req.params.name

        const course = await Course.readCourse(semester, name)

        res.status(StatusCodes.OK).json({ course: course })
    } catch (error) {
        next(error)
    }
}

export const updateCourse = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const name = req.params.name

        const update = req.body

        const course = await Course.updateCourse(semester, name, update)

        res.status(StatusCodes.OK).json({ course: course })
    } catch (error) {
        next(error)
    }
}

export const updateCourseGroups = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const name = req.params.name

        const addGroupsToCourse = req.body.addGroups === undefined ? [] : req.body.addGroups
        const removeGroupsFromCourse = req.body.removeGroups === undefined ? [] : req.body.removeGroups
        const changeTeacherOfGroupsInCourse = req.body.editTeacherOf === undefined ? [] : req.body.editTeacherOf

        await Course.updateGroupInfo(semester, name, {
            addGroupsToCourse: addGroupsToCourse,
            removeGroupsFromCourse: removeGroupsFromCourse,
            changeTeacherOfGroupsInCourse: changeTeacherOfGroupsInCourse 
        })

        res.status(StatusCodes.OK).send()
    } catch (error) {
        next(error)
    }
}

export const deleteCourse = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const name = req.params.name

        const result = await Course.deleteCourse(semester, name)

        res.status(StatusCodes.OK).send()
    } catch (error) {
        next(error)
    }
}
