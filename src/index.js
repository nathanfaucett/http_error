var forEach = require("for_each"),
    create = require("create"),
    STATUS_CODES = require("status_codes");


var STATUS_NAMES = {},
    STATUS_STRINGS = {};


forEach(STATUS_CODES, function(status, code) {
    var name;

    if (code < 400) return;

    name = status.replace(/\s+/g, "");

    if (!(/\w+Error$/.test(name))) name += "Error";
    STATUS_NAMES[code] = name;
    STATUS_STRINGS[code] = status;
});


function HttpError(code, message) {
    if (message instanceof Error) message = message.message;

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

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

    this.name = STATUS_NAMES[code] || "UnknownHttpError";
    this.code = code;
    this.message = this.name + ": " + code + " " + (message || STATUS_STRINGS[code]);
}
HttpError.prototype = create(Error.prototype);
HttpError.prototype.constructor = HttpError;

HttpError.prototype.toString = function() {

    return this.message;
};

HttpError.prototype.toJSON = function(json) {
    json || (json = {});

    json.name = this.name;
    json.code = this.code;
    json.message = this.message;

    return json;
};

HttpError.prototype.fromJSON = function(json) {

    this.name = json.name;
    this.code = json.code;
    this.message = json.message;

    return this;
};


module.exports = HttpError;
