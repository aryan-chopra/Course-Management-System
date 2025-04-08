import express from "express"
import { createInstitute } from "../controllers/institute.js"

const InstituteRoutes = express()

InstituteRoutes.post("/create", createInstitute)

export default InstituteRoutes
