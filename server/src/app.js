import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { readFile } from 'fs/promises';
import { clerkMiddleware } from '@clerk/express'

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

// healthcheck
import healthcheckRouter from "./routes/healthcheck.route.js"
app.use("/api/v1/healthcheck", healthcheckRouter)

// protected routes
app.use(clerkMiddleware())

// multer test - Debugging
// import testRouter from "./routes/multertest.route.js";
// app.use("/api/v1/multer-check", testRouter);


//routes import
import aiRouter from "./routes/ai.route.js";
import userRouter from "./routes/user.route.js"


//routes declaration
app.use("/api/v1/ai", aiRouter)
app.use("/api/v1", userRouter)


export { app }