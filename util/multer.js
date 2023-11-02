/* eslint-disable operator-linebreak */
const multer = require('multer');
const path = require('path');

const UPLOADS_FOLDER = './public/images/Perfumes';

// Define the Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${file.originalname
            .replace(fileExtension, '')
            .toLowerCase()
            .split(' ')
            .join('-')}-${Date.now()}`;

        console.log(`${new Date(Date.now()).toLocaleDateString()} - Added an Image`);

        cb(null, fileName + fileExtension);
    },
});

// prepare the final multer object
const upload = multer({
    storage,
    limits: {
        fileSize: 5000000,
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true); // callbacks first parameter is error then 2nd is true/false
        } else {
            cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
        }
    },
});

module.exports = upload;
