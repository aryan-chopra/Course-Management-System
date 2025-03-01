import express from "express";
import { createGlobalCourse, deleteGlobalCourse, readGlobalCourse, updateGlobalCourse } from "../controllers/globalCourse.js";


const GlobalCourseRoutes = express()

GlobalCourseRoutes.get('/', (req, res) => {
    res.send("Viewing course home page")
})

GlobalCourseRoutes.post('/create', createGlobalCourse)

GlobalCourseRoutes.get('/:id', readGlobalCourse)

GlobalCourseRoutes.put('/:id', updateGlobalCourse)

GlobalCourseRoutes.delete('/:id',deleteGlobalCourse)

export default GlobalCourseRoutes
