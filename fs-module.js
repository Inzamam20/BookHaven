require('dotenv').config();
const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

process.env.PRIVATE_KEY = privateKey;
process.env.PUBLIC_KEY = publicKey;

console.log(process.env.PRIVATE_KEY);
console.log(process.env.PUBLIC_KEY);
