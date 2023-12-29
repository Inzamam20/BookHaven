/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');

const connection = require('../util/database');

const { viewAllOrders, updateOrderStatusById } = require('../util/queries/admin/queries');

const getDashboard = (req, res) => {
    res.render('./admin/dashboard.ejs');
};

// const getani = (req, res) => {
//     console.log(req.body);
//     // httpMsg.sendJSON(req, res, {
//     //     msg: 'Hello',
//     // });
//     res.send({
//         msg: 'okasd',
//     });
//     // res.render('./admin/dashboard.ejs');
// };

const getAddPerfume = (req, res) => {
    const perfumeName = req.flash('name');
    let { dbSuccess } = req.cookies;
    if (dbSuccess === undefined) {
        dbSuccess = 'false';
    }
    // console.log(dbSuccess);

    // Sending Cookie
    res.cookie('dbSuccess', dbSuccess);
    res.clearCookie('dbSuccess');

    // Setting Header
    res.set('dbSuccess', dbSuccess);

    // req.flash('dbSuccess');
    res.render('./admin/options/addperfume', { perfumeName, dbSuccess });
};

const postAddPerfume = (req, res) => {
    const {
 perfumeName, brand, price, quantity, selectedVolume, description,
} = req.body;

    // Read the uploaded file
    const image = fs.readFileSync(req.file.path);

    let volume;

    if (selectedVolume === '1') {
        volume = 3;
    } else if (selectedVolume === '2') {
        volume = 5;
    } else if (selectedVolume === '3') {
        volume = 500;
    }

    const ppml = parseFloat((price / volume).toFixed(2));
    const quantitiesLeft = (volume * parseInt(quantity, 10));

    // Data Validation
    // if (description === '') {
    //     description = 'N/A';
    // }

    // const errors = [];

    // Add perfume to the Database
    connection.execute(
        // eslint-disable-next-line max-len
        // INSERT INTO `perfumeparlor2.0`.`perfume` (`ID`, `Name`, `Brand`, `PPml`, `Quantity`, `Thumbnail`, `Description`) VALUES (NULL, 'asd', 'asd', '20', '2', ?, 'asd');
        'INSERT INTO perfume (Name, Brand, PPml, Quantity, Thumbnail, Description) VALUES (?, ?, ?, ?, ?, ?)',
        [
            perfumeName,
            brand,
            ppml,
            quantitiesLeft,
            image,
            description,
        ],
        (er) => {
            if (er) {
                console.log(`An error occured: ${er.message}`);
            }
            console.log('Perfume Added Successfully into the Database!');
            // Delete the temporary file after insertion
            fs.unlinkSync(req.file.path);
            // errors.push('Perfume Added Successfully!');
            // req.flash('errors', errors);
            req.flash('name', perfumeName);

            // res.set('dbSuccess', true);
            res.header('dbSuccess', true);
            res.cookie('dbSuccess', true);

            // setTimeout(() => {
            //     res.redirect('addPerfume');
            // }, 1000);
            res.redirect('addPerfume');
        },
    );
};

const getOrders = async (req, res) => {
    try {
        const orders = await viewAllOrders();
        console.log(orders);
        res.render('./admin/options/orders', { orders });
    } catch (error) {
        console.log(error.toString());
    }
};

const updateOrderStatusController = async (req, res) => {
    const { orderId } = req.params; // Extract order ID from the URL
    const { newStatus } = req.body;

    console.log(`Order ID: ${orderId}`);
    // console.log(req.body);
    console.log(newStatus);

    try {
        await updateOrderStatusById(orderId, newStatus);
        res.status(200).json({ success: true, message: "Never Include contentType: 'application/json'" });
    } catch (error) {
        console.log(error.toString());
    }
};

module.exports = {
    getDashboard,
    getAddPerfume,
    postAddPerfume,
    // getani,
    getOrders,
    updateOrderStatusController,
};
