import express from "express"
import { cancelContract, createContract, extendContract, getAllContract, updateAllRoomStudentCounts } from "../controllers/contractController.js"
import { authentication } from "../middleware/auth.js"

const contractRouter = express.Router()

contractRouter.post("/createContract", createContract)
contractRouter.patch("/extendContract", extendContract)
contractRouter.delete("/cancelContract", cancelContract)
contractRouter.get("/getAllContract", getAllContract)
contractRouter.post("/updateAllRoomStudentCounts", updateAllRoomStudentCounts)

export default contractRouter