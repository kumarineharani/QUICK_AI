import swaggerAutogen from 'swagger-autogen';
import { mkdirSync, existsSync } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output directory exists
const ensureDirectoryExists = (filePath) => {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
};

const doc = {
  info: {
    title: 'QUICK_AI',
    description: 'API documentation for QUICK_AI project. Provides AI and user-related endpoints.',
    version: '1.0.0'
  },
  host: process.env.SWAGGER_HOST || 'localhost:4242',
  basePath: '/api/v1',
  schemes: process.env.SWAGGER_SCHEME ? [process.env.SWAGGER_SCHEME] : ['http'],
  tags: [
    { name: 'health', description: 'System health checks' },
    { name: 'ai', description: 'AI-related operations' },
    { name: 'user', description: 'User related operations' },
  ]
};

const outputFile = path.join(__dirname, "docs/generated/swagger-output.json");
const routes = [path.join(__dirname, "../app.js")];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
// swaggerAutogen()(outputFile, routes, doc);

const generateSwaggerDocs = async () => {
  try {
    ensureDirectoryExists(outputFile);
    
    await swaggerAutogen()(outputFile, routes, doc);
    console.log('✅ Swagger documentation generated successfully!');
    console.log('📍 File location: ./src/docs/generated/swagger-output.json');
    console.log(`🌐 View at: ${process.env.SWAGGER_SCHEME || 'http'}://${process.env.SWAGGER_HOST || 'localhost:4242'}/api-docs`);

  } catch (error) {
    console.error('❌ Error generating swagger documentation:', error.message);
    process.exit(1);
  }
};

// Run the generation
generateSwaggerDocs();
