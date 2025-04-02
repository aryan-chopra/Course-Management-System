import express from "express"
import { authenticate } from "../middlewares/authenticate.js"
import { readTeacher } from "../controllers/teacher.js"

const TeacherRoutes = express()

TeacherRoutes.use(authenticate)

TeacherRoutes.get('/', async (req, res, next) => {
    res.send("Viewing teacher home page")
})

TeacherRoutes.get('/view', readTeacher)

export default TeacherRoutes
