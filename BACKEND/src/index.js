import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/index.js"

dotenv.config({
    path : "../.env"
})

connectDB()
.then( () => {

    app.listen(process.env.PORT || 8000 , () => {
        console.log("Server listening on port :",process.env.PORT);
    })

} )
.catch( (error) => {
    console.log("No Running Server - Invalid DB Connection ",error);
} )