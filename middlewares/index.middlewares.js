const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    // const { authorization } = req.headers;
    const token = req.cookies.accessToken;
    // console.log(`Token Value: ${token}`);
    if (token === undefined) {
        // If there is no Token, continue without setting req.user
        next();
    } else {
        // console.log(token);
        // console.log('Inzamam');
        if (!token) {
            // If there is no Token, continue without setting req.user
            next();
        }
        /* For handling JWT Token while sending in Header
        // console.log(token);
        // const token = authorization.split(' ')[1];
        // console.log(token);
        */
        try {
            // Verify the token - this will throw an error if the token has expired
            const verified = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
            // If the token is verified Successfully, set the user in the request
            req.user = verified;
            // console.log(verified);
            // console.log('From the index MiddleWare!');
            next();
        } catch (error) {
            // If the error is because of expiration
            if (error instanceof jwt.TokenExpiredError) {
                // Token has expired
                // So clearing the expired token cookie, so it's not sent in future requests
                res.removeHeader('authorization');
                res.clearCookie('accessToken');
                res.render('/users/login');
            } else {
                next();
            }
        }
    }
};

module.exports = { authenticateJWT };
