import express from "express"
import { addRowRoom, deleteRowOfRoom, getAllRowRoom, updateRowRoom, getGenerateMaDayPhong } from "../controllers/rowOfRoomController.js"
import { authentication } from "../middleware/auth.js"


const rowRoomRouter = express.Router()

rowRoomRouter.post("/addRowRoom", addRowRoom)
rowRoomRouter.patch("/updateRowRoom", updateRowRoom)
rowRoomRouter.delete("/deleteRowRoom", deleteRowOfRoom)
rowRoomRouter.get("/getAllRowRoom", getAllRowRoom)
rowRoomRouter.get("/generateMaDayPhong", getGenerateMaDayPhong)

export default rowRoomRouter