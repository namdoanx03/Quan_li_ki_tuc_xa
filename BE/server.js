import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { connectDB } from "./config/connectDb.js"
import userRouter from "./routers/userRouter.js"
import roomRouter from "./routers/roomRouter.js"
import rowRoomRouter from "./routers/rowRoomRouter.js"
import serviceRouter from "./routers/serviceRouter.js"
import contractRouter from "./routers/contractRouter.js"
import billRouter from "./routers/billRouter.js"

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to database
connectDB()

// Routes
app.use("/api/user", userRouter)
app.use("/api/room", roomRouter)
app.use("/api/rowRoom", rowRoomRouter)
app.use("/api/service", serviceRouter)
app.use("/api/contract", contractRouter)
app.use("/api/bill", billRouter)

// Health check route
app.get("/", (req, res) => {
    res.json({
        message: "Server is running on port " + port
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: err.message
    })
})

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})