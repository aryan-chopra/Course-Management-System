import express from "express"
import { readStudent, readStudentResources } from "../controllers/student.js"
import { authenticate } from "../middlewares/authenticate.js"

const StudentRoutes = express()

StudentRoutes.use(authenticate)

StudentRoutes.get('/', (req, res) => {
    res.send("Viewing student home page")
})

StudentRoutes.get('/resources', readStudentResources)

StudentRoutes.get('/:rollnumber', readStudent)

export default StudentRoutes
