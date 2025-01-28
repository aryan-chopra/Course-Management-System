import express from "express";
import GlobalCourse from "../controllers/globalCourse.js";

const GlobalCourseRoutes = express()

GlobalCourseRoutes.get('/', (req, res) => {
    res.send("Viewing course home page")
})

GlobalCourseRoutes.get('/:id', GlobalCourse.getGlobalCourse)

GlobalCourseRoutes.post('/create', GlobalCourse.createGlobalCourse)

GlobalCourseRoutes.put('/edit/:id', (req, res) => {
    res.send("Editing course: " + req.params.id)
})

GlobalCourseRoutes.delete('/delete/:id', (req, res) => {
    res.send("Deleting course: " + req.params.id)
})

export default GlobalCourseRoutes
