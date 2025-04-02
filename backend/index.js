import express from "express"

import { connectToDatabase } from "./db.js"
import CourseRoutes from "./routes/course.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import GroupRoutes from "./routes/group.js"
import ResourceRoutes from "./routes/resource.js"
import StudentRoutes from "./routes/student.js"
import TeacherRoutes from "./routes/teacher.js"
import UserRoutes from "./routes/user.js"

const app = express()

//PORT
const port = 3000

connectToDatabase()

app.use(express.json())

//Routes
app.get('/', (req, res) => {
    res.send("Welcome to the Course Management System!")
})

//Defining middlewares for specific routes/tasks
app.use('/course', CourseRoutes)
app.use('/group', GroupRoutes)
app.use('/resource', ResourceRoutes)
app.use('/student', StudentRoutes)
app.use('/teacher', TeacherRoutes)
app.use('/user', UserRoutes)

//Error Handling
app.use(errorHandler)

//Init
console.log("Listening at localhost:" + port)
app.listen(port)
