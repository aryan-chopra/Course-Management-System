import express from "express";

const courseRoutes = express()

courseRoutes.get('/', (req, res) => {
    res.send("Viewing course home page")
})

courseRoutes.get('/:id', (req, res) => {
    res.send("Viewing course with id: " + req.params.id)
})

courseRoutes.post('/create', (req, res) => {
    res.send("Creating course!")
})

courseRoutes.put('/edit/:id', (req, res) => {
    res.send("Editing course: " + req.params.id)
})

courseRoutes.delete('/delete/:id', (req, res) => {
    res.send("Deleting course: " + req.params.id)
})

export default courseRoutes
