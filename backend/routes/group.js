import express from "express";
import { createGroup, createGroupResource, deleteGroup, readGroup, updateGroup } from "../controllers/group.js";
import { authenticate } from "../middlewares/authenticate.js";

const GroupRoutes = express()

GroupRoutes.use(authenticate)

GroupRoutes.get('/', (req, res) => {
    res.send("Viewing groups home page")
})

GroupRoutes.post('/create', createGroup)

GroupRoutes.post('/:semester/:number/resource/create', createGroupResource)

GroupRoutes.get('/:semester/:number', readGroup)

GroupRoutes.put('/:semester/:number', updateGroup)

GroupRoutes.delete('/:semester/:number', deleteGroup)

export default GroupRoutes
