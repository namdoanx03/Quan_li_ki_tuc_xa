import express from "express"
import { addRoom, deleteRoom, updateRoom, getAllRoom } from "../controllers/roomController.js"
import { authentication } from "../middleware/auth.js"

const roomRouter = express.Router()

roomRouter.post("/addRoom", addRoom)
roomRouter.patch("/updateRoom", updateRoom)
roomRouter.delete("/deleteRoom", deleteRoom)
roomRouter.get("/getAllRoom", getAllRoom)

export default roomRouter