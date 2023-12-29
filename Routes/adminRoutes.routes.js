/* eslint-disable operator-linebreak */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
// const multer = require('multer');
// const path = require('path');

const router = express.Router();

// const UPLOADS_FOLDER = './public/images/Perfumes';

const upload = require('../util/multer');

const {
    getDashboard,
    getAddPerfume,
    postAddPerfume,
    // getani,
    getOrders,
    updateOrderStatusController,
} = require('../controllers/admin.controller');

// // Define the Storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, UPLOADS_FOLDER);
//     },
//     filename: (req, file, cb) => {
//         const fileExtension = path.extname(file.originalname);
//         // const fileName = `${postAddPerfume.perfumeName}-${postAddPerfume.brand}`;
//         const fileName = `${file.originalname
//             .replace(fileExtension, '')
//             .toLowerCase()
//             .split(' ')
//             .join('-')}-${Date.now()}`;
//         console.log(`${new Date(Date.now()).toLocaleString()} - Added a new Perfume`);

//         cb(null, fileName + fileExtension);
//     },
// });

// // Prepare the Final multer upload object
// const upload = multer({
//     // dest: UPLOADS_FOLDER,
//     storage,
//     limits: {
//         fileSize: 5000000, // 5 MB
//     },
//     fileFilter: (req, file, cb) => {
//         if (
//             file.mimetype === 'image/png' ||
//             file.mimetype === 'image/jpg' ||
//             file.mimetype === 'image/jpeg'
//         ) {
//             cb(null, true); // callbacks first parameter is error then 2nd is true/false
//         } else {
//             cb(new Error('Only .jpg, .png or .jpeg format allowed!'));
//         }
//     },
// });

router.get('/dashboard', getDashboard);
// router.post('/dashboard', getAddPerfume);

router.get('/addPerfume', getAddPerfume);
router.post('/addPerfume', upload.single('perfumeImage'), postAddPerfume);

router.get('/orders', getOrders);

router.post('/api/orders/updateOrderStatus/:orderId', updateOrderStatusController);
// router.get('/anitesting', getani);

module.exports = router;
