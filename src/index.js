var STATUS_CODES = require("status_codes");


var STATUS_NAMES = {},
    STATUS_STRINGS = {};


Object.keys(STATUS_CODES).forEach(function(code) {
    if (code < 400) return;
    var status = STATUS_CODES[code],
        name = status.replace(/\s+/g, "");

    if (!(/\w+Error$/.test(name))) name += "Error";
    STATUS_NAMES[code] = name;
    STATUS_STRINGS[code] = status;
});


function HttpError(code, message) {
    if (code instanceof Error) {
        message = code.message;
        code = 500;
    } else if (typeof(code) === "string") {
        message = code;
        code = 500;
    } else {
        code || (code = 500);
    }

    Error.call(this);

    this.name = STATUS_NAMES[code] || "UnknownHttpError";
    this.statusCode = code;
    this.message = this.name + ": " + code + " " + (message || STATUS_STRINGS[code]);
    Error.captureStackTrace(this, this.constructor);

    return this;
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;
HttpError.prototype._super = Error.prototype;

HttpError.prototype.toString = function() {

    return this.message;
};

HttpError.prototype.toJSON = function(json) {
    json || (json = {});

    json.name = this.name;
    json.statusCode = this.statusCode;
    json.message = this.message;

    return json;
};

HttpError.prototype.fromJSON = function(json) {

    this.name = json.name;
    this.statusCode = json.statusCode;
    this.message = json.message;

    return this;
};


module.exports = HttpError;
