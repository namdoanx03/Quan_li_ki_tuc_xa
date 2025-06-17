import express from "express"
import { addRoom, deleteRoom, updateRoom } from "../controllers/roomController.js"
import { authentication } from "../middleware/auth.js"

const roomRouter = express.Router()

roomRouter.post("/addRoom", addRoom)
roomRouter.patch("/updateRoom", updateRoom)
roomRouter.delete("/deleteRoom", deleteRoom)

export default roomRouter