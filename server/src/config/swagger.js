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
    description: 'API documentation for QUICK_AI project. Provides AI and user-related endpoints.',
    version: '1.0.0'
  },
  host: `localhost:${process.env.PORT}`,
  basePath: '/api/v1',
  schemes: ['http'],
  tags: [
    { name: 'health', description: 'System health checks' },
    { name: 'ai', description: 'AI-related operations' },
    { name: 'user', description: 'User related operations' },
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
    console.log(`🌐 View at: http://localhost:${process.env.PORT || 4242}/api-docs`);
  } catch (error) {
    console.error('❌ Error generating swagger documentation:', error.message);
    process.exit(1);
  }
};

// Run the generation
generateSwaggerDocs();
