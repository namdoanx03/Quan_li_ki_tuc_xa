import express from "express"
import { addService, deleteService, getAllService, updateService } from "../controllers/serviceController.js"


const serviceRouter = express.Router()

serviceRouter.post("/addService", addService)
serviceRouter.patch("/updateService", updateService)
serviceRouter.delete("/deleteService", deleteService)
serviceRouter.get("/getAllService", getAllService)

export default serviceRouter