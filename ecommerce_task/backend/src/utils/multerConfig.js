const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/products/';
        
        // Automatically create the folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Cleaning filenames: Windows doesn't allow ":" in filenames
        // which can happen if you use new Date().toISOString()
        const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/[:]/g, '-');
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;