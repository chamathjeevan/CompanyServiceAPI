'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorMiddleware = undefined;

var _log4js = require('log4js');

var _ErrorCodes = require('../helpers/ErrorCodes');

var _ErrorMessages = require('../helpers/ErrorMessages');

var _Errors = require('../extensions/Errors');

var _ErrorCodeMapper = require('../helpers/ErrorCodeMapper');

var _ErrorCodeMapper2 = _interopRequireDefault(_ErrorCodeMapper);

//var _Email = require('../utils/Email');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _log4js.getLogger)('app');

/* eslint-disable no-unused-vars */
var ErrorMiddleware = exports.ErrorMiddleware = function ErrorMiddleware(err, req, res, next) {
  var output = {};
  logger.error(err);
  try {
    if (err instanceof _Errors.ApiError) {
      output.code = err.code;
      output.message = err.message;
    } else {
      output.code = _ErrorCodes.INTERNAL_ERROR;
      output.message = _ErrorMessages.DATABASE_ERROR_MSG;
      /*(0, _Email.sendAlert)({
        subject: '[PAYROLL API] Unexpected Error',
        additionalNotes: 'Non APIError has thrown',
        error: err
      });*/
    }

    output.additionalInfo = err.additionalInfo || null;
    res.status(_ErrorCodeMapper2.default.get(err.code) || _ErrorCodeMapper2.default.get(_ErrorCodes.INTERNAL_ERROR)).send(output);
  } catch (e) {
   /* (0, _Email.sendAlert)({
      subject: '[PAYROLL API] Unexpected Error',
      additionalNotes: '',
      error: e
    });*/
    output.message = 'Internal Error';
    output.code = _ErrorCodes.INTERNAL_ERROR;
    res.status(_ErrorCodeMapper2.default.get(_ErrorCodes.INTERNAL_ERROR)).send(output);
  }
};