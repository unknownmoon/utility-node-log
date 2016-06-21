'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('./lib/logger');

Object.keys(_logger).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _logger[key];
    }
  });
});
//# sourceMappingURL=index.js.map
