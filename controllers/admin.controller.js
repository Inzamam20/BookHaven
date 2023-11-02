/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');

const connection = require('../util/database');

const getDashboard = (req, res) => {
    res.render('./admin/dashboard.ejs');
};

const getani = (req, res) => {
    console.log(req.body);
    // httpMsg.sendJSON(req, res, {
    //     msg: 'Hello',
    // });
    res.send({
        msg: 'okasd',
    });
    // res.render('./admin/dashboard.ejs');
};

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

    // Data Validation
    // if (description === '') {
    //     description = 'N/A';
    // }

    // const errors = [];

    // Add perfume to the Database
    connection.execute(
        // eslint-disable-next-line max-len
        'INSERT INTO perfumes (Name, Brand, Price, Quantity, Thumbnail, Description, volume) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
            perfumeName,
            brand,
            parseInt(price, 10),
            parseInt(quantity, 10),
            image,
            description,
            volume,
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

module.exports = {
    getDashboard,
    getAddPerfume,
    postAddPerfume,
    getani,
};
