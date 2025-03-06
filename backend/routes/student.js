import express from "express"
import { createStudent, readStudent, readStudentCourses } from "../controllers/student.js"

const StudentRoutes = express()

StudentRoutes.get('/', (req, res) => {
    res.send("Viewing student home page")
})

StudentRoutes.post('/create', createStudent)

StudentRoutes.get('/:rollnumber', readStudent)

StudentRoutes.get('/:semester/:group', readStudentCourses)

export default StudentRoutes
