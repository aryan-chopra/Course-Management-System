import express from "express"
import { createUser, deleteUser, loginUser } from "../controllers/user.js"
import { authenticate } from "../middlewares/authenticate.js"

const UserRoutes = express()

UserRoutes.get("/login", loginUser)

UserRoutes.post("/create", createUser)

UserRoutes.delete("/delete", authenticate, deleteUser)

export default UserRoutes
