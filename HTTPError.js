module.exports = class HTTPError extends Error {
    constructor(statusCode, body) {
        super();
        this.statusCode = statusCode;
        this.body = body;
    }
}