import {} from "dotenv/config";
import { neon } from '@neondatabase/serverless';

const sql = neon(`${process.env.DATABASE_URL}`);

const connectDB = async () => {
    try {
        const response = await sql`SELECT version()`;
        const { version } = response[0];
        console.log(`✅ DATABASE CONNECTED !! DB HOST : ${version}`)
        
    } catch (error) {
        console.log(`⚠️  DATABASE CONNECTION ERROR : ${error.message}`)
        process.exit(1)
    }
}

export {sql};
export default connectDB;