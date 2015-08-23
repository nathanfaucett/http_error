var tape = require("tape"),
    HttpError = require("..");


tape("HttpError(statusCode, message[, fileName[, lineNumber]])", function(assert) {
    var error = new HttpError(404);

    assert.equals(error instanceof Error, true);
    assert.equals(error.name, "NotFoundError");
    assert.equals(error.statusCode, 404);
    assert.equals(error.message, "NotFoundError: 404 Not Found");

    assert.end();
});
