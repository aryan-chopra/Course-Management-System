import express from "express"
import { readStudent, readStudentCourses } from "../controllers/student.js"
import { authenticate } from "../middlewares/authenticate.js"

const StudentRoutes = express()

StudentRoutes.use(authenticate)

StudentRoutes.get('/', (req, res) => {
    res.send("Viewing student home page")
})

StudentRoutes.get('/:rollnumber', readStudent)

StudentRoutes.get('/:semester/:group', readStudentCourses)

export default StudentRoutes
