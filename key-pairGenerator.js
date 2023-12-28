require('dotenv').config();
const crypto = require('crypto');

// Key Pair Generator using crypto for RS256 Algorithm encryption
// used in JWT Authentication
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

process.env.PRIVATE_KEY = privateKey;
process.env.PUBLIC_KEY = publicKey;

// Copy and Paste the result of the key pair inside the JWT file
console.log(process.env.PRIVATE_KEY);
console.log(process.env.PUBLIC_KEY);
