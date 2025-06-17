import express from "express"
import { createStudent, deleteStudent, getAllStudent, getStudentByMaSV, login } from "../controllers/userController.js"
import { authentication } from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/login",login)
userRouter.post("/addStudent", createStudent)
userRouter.delete("/deleteStudent", deleteStudent)
userRouter.get("/getAllStudent",  getAllStudent)
userRouter.get("/getStudentMaSV", getStudentByMaSV)

export default userRouter