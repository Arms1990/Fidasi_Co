'use strict';

/**
 * Module dependencies.
 */

var AbstractGrantType = require('./abstractGrantType');
var InvalidArgumentError = require('../errors/invalidArgumentError');
var InvalidGrantError = require('../errors/invalidGrantError');
var InvalidRequestError = require('../errors/invalidRequestError');
var Promise = require('bluebird');
var promisify = require('promisify-any').use(Promise);
var is = require('../validator/is');
var util = require('util');

/**
 * Constructor.
 */

function PasswordGrantType(options) {
  options = options || {};

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }

  if (!options.model.getUser) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getUser()`');
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
  }

  AbstractGrantType.call(this, options);
}

/**
 * Inherit prototype.
 */

util.inherits(PasswordGrantType, AbstractGrantType);

/**
 * Retrieve the user from the model using a username/password combination.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.3.2
 */

PasswordGrantType.prototype.handle = function(request, client) {
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`');
  }

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`');
  }

  var scope = this.getScope(request);

  return Promise.bind(this)
    .then(function() {
      return this.getUser(request);
    })
    .then(async function(user) {
      return await this.saveToken(user, client, scope);
    });
};

/**
 * Get user using a username/password combination.
 */

PasswordGrantType.prototype.getUser = function(request) {
  if (!request.body.username) {
    throw new InvalidRequestError('Missing parameter: `username`');
  }

  if (!request.body.password) {
    throw new InvalidRequestError('Missing parameter: `password`');
  }

  if (!is.uchar(request.body.username)) {
    throw new InvalidRequestError('Invalid parameter: `username`');
  }

  if (!is.uchar(request.body.password)) {
    throw new InvalidRequestError('Invalid parameter: `password`');
  }

  return promisify(this.model.getUser, 2).call(this.model, request.body.username, request.body.password)
    .then(function(user) {
      if (!user) {
        throw new InvalidGrantError('Invalid grant: user credentials are invalid');
      }

      return user;
    });
};

/**
 * Save token.
 */

PasswordGrantType.prototype.saveToken = async function(user, client, scope) {
  try {
    var fns = [
      this.validateScope(user, client, scope),
      this.generateAccessToken(client, user, scope),
      this.generateRefreshToken(client, user, scope),
      this.getAccessTokenExpiresAt(),
      this.getRefreshTokenExpiresAt()
    ];
  
    return await Promise.all(fns)
      .bind(this)
      .spread(function(scope, accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt) {
        var token = {
          accessToken: accessToken,
          accessTokenExpiresAt: accessTokenExpiresAt,
          refreshToken: refreshToken,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
          // scope: scope
        };
        return promisify(this.model.saveToken, 3).call(this.model, token, client, user);
      });
  } catch(e) {
    console.error(e);
  }
};

/**
 * Export constructor.
 */

module.exports = PasswordGrantType;