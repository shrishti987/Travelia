class ExpressError extends Error {
    constructor(statusCode, message) {
        super();   // important
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;