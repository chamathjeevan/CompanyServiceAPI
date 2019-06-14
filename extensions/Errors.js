'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputParameterError = exports.AuthenticationError = exports.PermissionError = exports.InternalError = exports.DBError = exports.ValidationError = exports.NetworkError = exports.ServerError = exports.ApiError = undefined;

var _util = require('util');

var _HttpCodes = require('../helpers/Httpcodes');

Error.extend = function (name) {
  var httpCode = arguments.length <= 1 || arguments[1] === undefined ? _HttpCodes.HTTP_CODE_500 : arguments[1];

  var ErrorType = function ErrorType() {
    var message = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var code = arguments[1];
    var additionalInfo = arguments[2];
    var httpErrorCode = arguments[3];

    if (!(this instanceof ErrorType)) {
      return new ErrorType(message, code, additionalInfo, httpErrorCode);
    }
    this.name = name;
    this.code = code;
    this.httpCode = httpErrorCode || httpCode;
    this.message = message;
    this.additionalInfo = additionalInfo;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }

    return this;
  };

  (0, _util.inherits)(ErrorType, this);

  ErrorType.prototype.toString = function () {
    return this.name + ': ' + (0, _util.inspect)(this.message);
  };

  ErrorType.extend = this.extend;
  return ErrorType;
}; // this is a package util
var ApiError = exports.ApiError = Error.extend('ApiError', _HttpCodes.HTTP_CODE_404);
// Connected to the server, however 400,500 range error is thrown
var ServerError = exports.ServerError = Error.extend('ServerError');
var NetworkError = exports.NetworkError = Error.extend('NetworkError'); // can not connect to the server.Netwrok unreachable
var ValidationError = exports.ValidationError = ApiError.extend('ValidationError', _HttpCodes.HTTP_CODE_400); // validation error
var DBError = exports.DBError = Error.extend('DBError', _HttpCodes.HTTP_CODE_500); //
var InternalError = exports.InternalError = Error.extend('InternalError');
var PermissionError = exports.PermissionError = Error.extend('PermissionError');
var AuthenticationError = exports.AuthenticationError = Error.extend('AuthenticationError', _HttpCodes.HTTP_CODE_400);
var InputParameterError = exports.InputParameterError = Error.extend('InputParameterError', _HttpCodes.HTTP_CODE_400);