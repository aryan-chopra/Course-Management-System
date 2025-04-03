import express from "express"

const ResourceRoutes = express()

ResourceRoutes.get('/', (req, res) => {
    res.send("Viewing Resource home page")
})

export default ResourceRoutes
