import express, { json, urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

//cors , urlencoded , json , cookie , static , multer

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.urlencoded({extended:true , limit:"16kb"}));

app.use(express.json({limit:"16kb"}));

app.use(express.static("public"));

app.use(cookieParser());

//routes
import userRouter from './routes/user.routes.js'

app.use('/api/v1/users',userRouter)

export default app;