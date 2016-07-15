HttpError
=======

HttpError for the browser and node.js

```javascript
var HttpError = require("@nathanfaucett/http_error");


var error = new HttpError(404);

error instanceof Error === true;
error.name === "NotFoundError";
error.statusCode === 404;
error.message === "NotFoundError: 404 Not Found";
```
