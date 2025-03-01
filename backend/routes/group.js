import express from "express";
import { createGroup, deleteGroup, readGroup, updateGroup } from "../controllers/group.js";

const GroupRoutes = express()

GroupRoutes.get('/', (req, res) => {
    res.send("Viewing groups home page")
})

GroupRoutes.post('/create', createGroup)

GroupRoutes.get('/:semester/:number', readGroup)

GroupRoutes.put('/:semester/:number', updateGroup)

GroupRoutes.delete('/:semester/:number', deleteGroup)

export default GroupRoutes
