import dotenv from "dotenv"
import express from "express"

dotenv.config({
    path : "./.env"
})

const app = express();

app.listen(process.env.PORT || 5000 , () => {
    console.log("Server running on port :",process.env.PORT);
})