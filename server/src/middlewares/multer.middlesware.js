import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { mkdirSync } from "fs";

// 🔹 Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔹 Ensure temp folder exists
const tempDir = path.join(__dirname, "../../public/temp");
mkdirSync(tempDir, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../public/temp"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
export const upload = multer({ storage })