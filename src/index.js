var objectForEach = require("object-for_each"),
    inherits = require("inherits"),
    STATUS_CODES = require("status_codes");


var STATUS_NAMES = {},
    STATUS_STRINGS = {},
    HttpErrorPrototype;


module.exports = HttpError;


objectForEach(STATUS_CODES, function eachStatus(status, statusCode) {
    var name;

    if (statusCode < 400) {
        return;
    }

    name = status.replace(/\s+/g, "");

    if (!(/\w+Error$/.test(name))) {
        name += "Error";
    }

    STATUS_NAMES[statusCode] = name;
    STATUS_STRINGS[statusCode] = status;
});


function HttpError(statusCode, message, fileName, lineNumber) {
    if (message instanceof Error) {
        message = message.message;
    }

    if (statusCode instanceof Error) {
        message = statusCode.message;
        statusCode = 500;
    } else if (typeof(statusCode) === "string") {
        message = statusCode;
        statusCode = 500;
    } else {
        statusCode = statusCode || 500;
    }

    Error.call(this, message, fileName, lineNumber);

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

    this.name = STATUS_NAMES[statusCode] || "UnknownHttpError";
    this.statusCode = statusCode;
    this.message = this.name + ": " + statusCode + " " + (message || STATUS_STRINGS[statusCode]);
}
inherits(HttpError, Error);
HttpErrorPrototype = HttpError.prototype;

HttpErrorPrototype.toString = function() {
    return this.message;
};

HttpErrorPrototype.toJSON = function(json) {
    json = json || {};

    json.name = this.name;
    json.statusCode = this.statusCode;
    json.message = this.message;

    return json;
};

HttpErrorPrototype.fromJSON = function(json) {

    this.name = json.name;
    this.statusCode = json.statusCode;
    this.message = json.message;

    return this;
};
