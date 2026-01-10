import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';

// Cloudinary storage setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'my_uploads', // Cloudinary folder name
        allowed_formats: ['jpg', 'png', 'jpeg'], // allowed file types
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // optional
    },
});

const upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } });


export default upload;