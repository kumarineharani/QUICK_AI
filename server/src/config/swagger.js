import swaggerAutogen from 'swagger-autogen';
import { mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

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
    description: 'Description',
    version: '1.0.0'
  },
  host: 'localhost:4000',
  tags: [
    { name: 'health', description: 'System health checks' },
  ]
};

const outputFile = './src/docs/generated/swagger-output.json';
const routes = ['./src/app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
// swaggerAutogen()(outputFile, routes, doc);

const generateSwaggerDocs = async () => {
  try {
    ensureDirectoryExists(outputFile);
    
    await swaggerAutogen()(outputFile, routes, doc);
    console.log('✅ Swagger documentation generated successfully!');
    console.log('📍 File location: ./src/docs/generated/swagger-output.json');
    console.log('🌐 View at: http://localhost:4000/api-docs');
  } catch (error) {
    console.error('❌ Error generating swagger documentation:', error.message);
    process.exit(1);
  }
};

// Run the generation
generateSwaggerDocs();
