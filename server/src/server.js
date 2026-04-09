import connectDB from "./config/database.js";
import {} from "dotenv/config";
import { app } from "./app.js"


connectDB()
.then( () => {
    app.on( "error", (error) => {
        console.error(`Server Error : ${error}`);
        throw error        
    })
    const port = process.env.PORT || 4242;
    app.listen( port, () => {
        console.info(`⚙️  Server running on port:${port}`);
    })
})
.catch( (error) => {
    console.error(`⚠️ DATABASE CONNECTION FAILED !! : ${error}`);
    
})