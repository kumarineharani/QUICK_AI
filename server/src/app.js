import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { readFile } from 'fs/promises';

const app = express()

import swaggerUi from "swagger-ui-express";
const swaggerDocument = JSON.parse(await readFile('./src/docs/generated/swagger-output.json', 'utf-8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'VideoTube API Documentation'
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb"}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
// import featureRouter from "./routes/featureName.route.js"


//routes declaration
// app.use("/api/v1/featureName", featureName)


export { app }