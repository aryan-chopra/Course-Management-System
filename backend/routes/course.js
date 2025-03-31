import express from "express";
import { createCourse, deleteCourse, readCourse, updateCourse, updateCourseGroups } from "../controllers/course.js";

const CourseRoutes = express()

CourseRoutes.get('/', (req, res) => {
    res.send("Viewing course home page")
})

CourseRoutes.post('/create', createCourse)

CourseRoutes.get('/:semester/:name', readCourse)

CourseRoutes.put('/:semester/:name', updateCourse)

CourseRoutes.put('/:semester/:name/updateGroups', updateCourseGroups)

CourseRoutes.delete('/:semester/:name',deleteCourse)

export default CourseRoutes
