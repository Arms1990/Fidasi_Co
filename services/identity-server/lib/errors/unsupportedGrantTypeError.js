'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var OAuthError = require('./oauthError');
var util = require('util');

/**
 * Constructor.
 *
 * "The authorization grant type is not supported by the authorization server."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */

function UnsupportedGrantTypeError(message, properties) {
  properties = _.assign({
    code: 400,
    name: 'unsupported_grant_type'
  }, properties);

  OAuthError.call(this, message, properties);
}

/**
 * Inherit prototype.
 */

util.inherits(UnsupportedGrantTypeError, OAuthError);

/**
 * Export constructor.
 */

module.exports = UnsupportedGrantTypeError;
