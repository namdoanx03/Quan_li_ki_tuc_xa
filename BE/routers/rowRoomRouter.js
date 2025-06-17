import express from "express"
import { addRowRoom, deleteRowOfRoom, getAllRowRoom, updateRowRoom } from "../controllers/rowOfRoomController.js"
import { authentication } from "../middleware/auth.js"


const rowRoomRouter = express.Router()

rowRoomRouter.post("/addRowRoom", addRowRoom)
rowRoomRouter.patch("/updateRowRoom", updateRowRoom)
rowRoomRouter.delete("/deleteRowRoom", deleteRowOfRoom)
rowRoomRouter.get("/getAllRowRoom", getAllRowRoom)

export default rowRoomRouter