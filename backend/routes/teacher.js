import express from "express"
import { createTeacher } from "../controllers/teacher.js"
import { authenticate } from "../middlewares/authenticate.js"

const TeacherRoutes = express()

TeacherRoutes.use(authenticate)

TeacherRoutes.get('/', async (req, res, next) => {
    res.send("Viewing teacher home page")
})

TeacherRoutes.post('/create', createTeacher)

export default TeacherRoutes
