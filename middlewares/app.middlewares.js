const logger = (req, res, next) => {
    const { method, url } = req;
    const date = new Date().getFullYear().toString();
    console.log(method, url, date);
    next();
};

const printSomething = (req, res, next) => {
    console.log('Print Something Middleware!');
    next();
};

module.exports = { logger, printSomething };
