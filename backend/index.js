import express from "express"

import { connectToDatabase } from "./db.js"
import GlobalCourseRoutes from "./routes/globalCourse.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import GroupRoutes from "./routes/group.js"

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
app.use('/course', GlobalCourseRoutes)
app.use('/group', GroupRoutes)

//Error Handling
app.use(errorHandler)

//Init
console.log("Listening at localhost:" + port)
app.listen(port)
