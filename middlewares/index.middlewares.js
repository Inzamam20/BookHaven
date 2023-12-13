const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const { authorization } = req.headers;

    console.log(authorization);
    // console.log('Inzamam');
    if (!authorization) {
        // If there is no Token, continue without setting req.user
        next();
    }
    console.log(authorization);
    const token = authorization.split(' ')[1];
    console.log(token);

    try {
        // Verify the token - this will throw an error if the token has expired
        const verified = jwt.verify(token, process.env.JWT_PUBLIC_KEY);

        // If the token is verified Successfully, set the user in the request
        console.log(verified);
        req.user = verified;
        next();
    } catch (error) {
        // If the error is because of expiration
        if (error instanceof jwt.TokenExpiredError) {
            // Token has expired
            // So clearing the expired token cookie, so it's not sent in future requests
            res.removeHeader('accessToken');
            // res.clearCookie('accessToken');
            res.redirect('/');
        } else {
            next('Invalild Token');
        }
    }
};

module.exports = authenticateJWT;
