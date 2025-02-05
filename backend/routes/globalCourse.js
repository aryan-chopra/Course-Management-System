import express from "express";
import GlobalCourse from "../controllers/globalCourse.js";

const GlobalCourseRoutes = express()

GlobalCourseRoutes.get('/', (req, res) => {
    res.send("Viewing course home page")
})

GlobalCourseRoutes.post('/create', GlobalCourse.createGlobalCourse)

GlobalCourseRoutes.get('/:id', GlobalCourse.readGlobalCourse)

GlobalCourseRoutes.put('/:id', GlobalCourse.updateGlobalCourse)

GlobalCourseRoutes.delete('/:id',GlobalCourse.deleteGlobalCourse)

export default GlobalCourseRoutes
