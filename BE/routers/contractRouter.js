import express from "express"
import { cancelContract, createContract, extendContract, getAllContract } from "../controllers/contractController.js"
import { authentication } from "../middleware/auth.js"

const contractRouter = express.Router()

contractRouter.post("/createContract", createContract)
contractRouter.patch("/extendContract", extendContract)
contractRouter.delete("/cancelContract", cancelContract)
contractRouter.get("/getAllContract", getAllContract)

export default contractRouter