import express from "express"
import courseRoutes from "./routes/course.js"
import { connectToDatabase } from "./db.js"

const app = express()

//PORT
const port = 3000

connectToDatabase()

//Routes
app.get('/', (req, res) => {
    res.send("Welcome to the Course Management System!")
})

//Defining middlewares for specific routes/tasks
app.use('/course', courseRoutes)

//Init
console.log("Listening at localhost:" + port)
app.listen(port)
