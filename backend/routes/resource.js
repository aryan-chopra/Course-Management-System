import express from "express"
import { createResource, readResource } from "../controllers/resource.js"

const ResourceRoutes = express()

ResourceRoutes.get('/', (req, res) => {
    res.send("Viewing Resource home page")
})

ResourceRoutes.post('/create', createResource)

ResourceRoutes.get('/:semester/:groupNumber/:course?', readResource)

export default ResourceRoutes
