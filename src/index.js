var http = require("http"),
	STATUS_CODES = http.STATUS_CODES,
	STATUS_NAMES = {},
	
	inflect = require("node-inflect");

Object.keys(STATUS_CODES).forEach(function(code){
	if (code < 400) return;
	var name = inflect.camelize(STATUS_CODES[code]);
	
	if (!/\w+Error$/.test(name)) name += "Error";
	STATUS_NAMES[code] = name;
});


function HttpError(code, message) {
	if (code instanceof Error) {
		message = code.message;
		code = 500;
	} else {
		code || (code = 500);
	}
	
	Error.call(this);
	
	this.name = STATUS_NAMES[code];
	this.statusCode = code;
	this.message = this.name +": "+ code +" "+ (message || STATUS_CODES[code]);
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;


HttpError.prototype.toString = function(){
	
	return this.message;
};


HttpError.prototype.toJSON = function(){
	
	return {
		name: this.name,
		statusCode: this.statusCode,
		message: this.message
	};
};


module.exports = HttpError;