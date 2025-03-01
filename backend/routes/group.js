import express from "express";
import { createGroup, readGroup, updateGroup } from "../controllers/group.js";

const GroupRoutes = express()

GroupRoutes.get('/', (req, res) => {
    res.send("Viewing groups home page")
})

GroupRoutes.post('/create', createGroup)

GroupRoutes.get('/:semester/:number', readGroup)

GroupRoutes.put('/:semester/:number', updateGroup)

export default GroupRoutes
