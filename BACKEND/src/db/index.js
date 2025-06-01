import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async function(){

    try {
        
        const result = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log("Database Connected Successfully :",result.connection.host);

    } catch (error) {
        console.log("Database Connection Failure !");
    }

}

export default connectDB;