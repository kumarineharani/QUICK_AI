import connectDB from "./config/database.js";
import {} from "dotenv/config";
import { app } from "./app.js"


connectDB()
.then( () => {
    app.on( "error", (error) => {
        console.log(`ERRORS : ${error}`);
        throw error        
    })
    app.listen( process.env.PORT, () => {
        console.log(`⚙️  Server running on http://localhost:${process.env.PORT}`);
    })
})
.catch( (error) => {
    console.log(`⚠️ DATABASE CONNECTION FAILED !! : ${error}`);
    
})