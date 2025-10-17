# QUICK AI ⚡

> A powerful AI SaaS platform providing multiple AI-powered tools for content creation, image generation, and professional development.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)

## 🚀 Features

### 🆓 Free Plan (10 Uses)
- **Article Generation** - AI-powered long-form content creation
- **Blog Title Generator** - Creative and SEO-friendly blog titles
- Access to all text-based AI tools

### 💎 Premium Plan (Unlimited)
- **All Free Features** (Unlimited usage)
- **AI Image Generation** - Create stunning images from text descriptions
- **Background Removal** - Professional background removal from images
- **Object Removal** - Remove unwanted objects from photos
- **Resume Review** - AI-powered resume analysis and feedback

## 🛠️ Tech Stack

### Frontend
- **React 19.1** - Modern UI library
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **Clerk** - Authentication & user management
- **React Router Dom** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Markdown** - Markdown rendering

### Backend
- **Node.js & Express** - Server framework
- **Neon Database** (PostgreSQL) - Serverless database
- **Clerk** - Authentication backend
- **Cloudinary** - Image storage and transformations
- **OpenAI SDK** - AI model integration (Gemini 2.0 Flash)
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **Swagger** - API documentation

## 📁 Project Structure

```
quick-ai/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── server/                 # Backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middlewares/   # Custom middlewares
│   │   ├── routes/        # API routes
│   │   ├── services/      # External services
│   │   ├── utils/         # Utility functions
│   │   ├── docs/          # API documentation
│   │   ├── app.js         # Express app
│   │   └── server.js      # Server entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Neon Database account
- Clerk account
- Cloudinary account
- Google AI Studio API key (Gemini)
- Vyro AI API token (for image generation)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/quick-ai.git
cd quick-ai
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Setup**

**Server (.env)**
```env
DATABASE_URL=your_neon_database_url

CORS_ORIGIN=http://localhost:5173

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

IMAGINE_TOKEN=your_imagine_art_token
```

**Client (.env)**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:4242/api/v1
```

4. **Run the application**

```bash
# Start server (from server directory)
npm run server

# Start client (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4242

## 📚 API Documentation

### Authentication
All API requests require authentication via Clerk. Include the session token in your requests.

### Endpoints

#### 📝 Article Generation
```http
POST /api/v1/ai/generate-article
Content-Type: application/json

{
  "prompt": "Write an article about AI",
  "length": 1000
}
```

#### 📰 Blog Title Generation
```http
POST /api/v1/ai/generate-blog-title
Content-Type: application/json

{
  "prompt": "Generate titles for AI trends"
}
```

#### 🎨 Image Generation (Premium)
```http
POST /api/v1/ai/generate-image
Content-Type: application/json

{
  "prompt": "A futuristic city at sunset",
  "publish": false
}
```

#### 🖼️ Remove Image Background (Premium)
```http
POST /api/v1/ai/remove-bg
Content-Type: multipart/form-data

{
  "image": <file>
}
```

#### ✂️ Remove Object from Image (Premium)
```http
POST /api/v1/ai/remove-object
Content-Type: multipart/form-data

{
  "image": <file>,
  "object": "person"
}
```

#### 📄 Resume Review (Premium)
```http
POST /api/v1/ai/resume-review
Content-Type: multipart/form-data

{
  "resume": <pdf-file>
}
```

### Response Format
```json
{
  "statusCode": 201,
  "data": {
    "id": 1,
    "user_id": "user_xxx",
    "prompt": "...",
    "content": "...",
    "type": "article"
  },
  "message": "Article Generated Successfully.",
  "success": true
}
```

### Error Handling
```json
{
  "statusCode": 400,
  "message": "Prompt is required.",
  "success": false,
  "errors": []
}
```

## 🎯 Usage Limits

| Feature | Free Plan | Premium Plan |
|---------|-----------|--------------|
| Article Generation | 10 uses | Unlimited |
| Blog Title Generation | 10 uses | Unlimited |
| Image Generation | ❌ | ✅ Unlimited |
| Background Removal | ❌ | ✅ Unlimited |
| Object Removal | ❌ | ✅ Unlimited |
| Resume Review | ❌ | ✅ Unlimited |

## 🔐 Security

- Authentication handled by Clerk
- Secure file upload with size limits (5MB for resumes)
- Environment variables for sensitive data
- Input validation and sanitization
- Rate limiting on API endpoints

## 🚀 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Backend (Render)
1. Push your code to GitHub
2. Create new Web Service on Render
3. Add environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@kumarineharani](https://github.com/kumarineharani)

## 🙏 Acknowledgments

- [Google AI Studio](https://ai.google.dev/) for Gemini API
- [Cloudinary](https://cloudinary.com/) for image processing
- [Clerk](https://clerk.com/) for authentication
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Imagine Art](https://www.imagine.art/) for image generation

## 📞 Support

For support, create an issue in this repository.

---

⭐ If you find this project useful, please consider giving it a star!
