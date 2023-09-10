// Synchronous and Asynchronous Function

// Read File
// Write File
// Append File
// Delete File
// Rename File

const fs = require('fs');

// fs.readFileSync();   // Synchronous Function
// fs.readFile();       // Asynchronous Function

// console.log(fs);

// fs.writeFileSync('./Contents/demoFile.txt', 'We are learning NodeJS.', (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('File written Successfully!');
//     }
// }); // No CallBack Function is needed in writeFileSync Funtion

//  We barely use synchronous method

// fs.writeFileSync('./Contents/demoFile.txt', 'We are learning JavaScript.');
// fs.appendFileSync('./Contents/demoFile.txt', 'We are learning NodeJS.');

// fs.rename('./Contents/demoFile.txt', './Contents/textFile.txt', (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Rename Successful!');
//     }
// });  // Callback Function is needed in Asynchronous Function

// fs.renameSync('./Contents/textFile.txt', './Contents/demoFile.txt', (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Rename Successful!');
//     }
// });

// console.log('before');

// fs.readFile('./Contents/demoFile.txt', 'utf-8', (err, data) => {
//     if (err) {
//         console.log(err);
//     } else {
//         // console.log(data);
//         fs.appendFile('./Contents/demoFile.txt', 'Is this a Synchronous Process? ', (err2) => {
//             if (err) {
//                 console.log(err2);
//             } else {
//                 console.log(data);
//             }
//         });
//         fs.readFile('./Contents/demoFile.txt', 'utf-8', (err3, data2) => {
//             if (err) {
//                 console.log(err3);
//             } else {
//                 console.log(data2);
//             }
//         });
//     }
// });

// fs.readFile('./Contents/demoFile.txt', 'utf-8', (err, data) => {
// This Function is Asychronous, So when the execution of this function is
// completed then we can see the result before even seeing the output of the previous function
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(`${data}From Asynchronous`);
//     }
// });

// console.log('After'); // Observe the Output Carefully

// setTimeout(() => {
//     fs.unlink('./Contents/demoFile.txt', (err) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('Delete Successful!');
//         }
//     });
// }, 5000);

// fs.unlink('./Contents/demoFile.txt', (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Delete Successful!');
//     }
// });

// fs.readFileSync('./.vscode/', 'ascii');

let about;
fs.readFile('./Contents/guarder-html/about.html', 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Data Retrieved Successfully!');
        about = data;
    }
});

let contact;
fs.readFile('./Contents/guarder-html/contact.html', 'ascii', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Data Retrieved Successfully!');
        contact = data;
    }
});

let service;
fs.readFile('./Contents/guarder-html/service.html', 'ascii', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Data Retrieved Successfully!');
        service = data;
        // console.log(service);
    }
});

let guard;
fs.readFile('./Contents/guarder-html/guard.html', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Data Retrieved Successfully!');
        guard = data;
    }
});

console.log(about);
// console.log(guard);
module.exports = {
    about,
    contact,
    service,
    guard,
};
