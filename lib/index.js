"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _zipkin = require("zipkin");

var zipkinRecordError = function zipkinRecordError(error, options) {
  var instrumentation = new _zipkin.Instrumentation.HttpClient(options);

  if (error.response) {
    instrumentation.recordResponse(options.tracer.id, error.response.status);
  } else {
    instrumentation.recordError(options.tracer.id, error);
  }

  return Promise.reject(error);
};

var zipkinRecordRequest = function zipkinRecordRequest(config, options) {
  var instrumentation = new _zipkin.Instrumentation.HttpClient(options);
  return instrumentation.recordRequest(config, config.url, config.method);
};

var zipkinRecordResponse = function zipkinRecordResponse(res, options) {
  var instrumentation = new _zipkin.Instrumentation.HttpClient(options);
  instrumentation.recordResponse(options.tracer.id, res.status);
  return res;
};

var wrapAxios = function wrapAxios(axios) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  axios.interceptors.request.use(function (config) {
    return zipkinRecordRequest(config, options);
  }, function (err) {
    return zipkinRecordError(err, options);
  });
  axios.interceptors.response.use(function (res) {
    return zipkinRecordResponse(res, options);
  }, function (err) {
    return zipkinRecordError(err, options);
  });
  return axios;
};

var _default = wrapAxios;
exports.default = _default;
module.exports = exports.default;