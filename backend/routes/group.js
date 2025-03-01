import express from "express";
import { createGroup } from "../controllers/group.js";

const GroupRoutes = express()

GroupRoutes.get('/', (req, res) => {
    res.send("Viewing groups home page")
})

GroupRoutes.post('/create', createGroup)

export default GroupRoutes
