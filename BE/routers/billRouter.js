import express from "express"
import { createBill } from "../controllers/billController.js"
import { authentication } from "../middleware/auth.js"

const billRouter = express.Router()

billRouter.post("/createBill", createBill)

export default billRouter