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
var ServerError = require('../errors/serverError');
var is = require('../validator/is');
var util = require('util');

/**
 * Constructor.
 */

function RefreshTokenGrantType(options) {
  options = options || {};

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }

  if (!options.model.getRefreshToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getRefreshToken()`');
  }

  if (!options.model.revokeToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `revokeToken()`');
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
  }

  AbstractGrantType.call(this, options);
}

/**
 * Inherit prototype.
 */

util.inherits(RefreshTokenGrantType, AbstractGrantType);

/**
 * Handle refresh token grant.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-6
 */

RefreshTokenGrantType.prototype.handle = function(request, client) {
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`');
  }

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`');
  }

  return Promise.bind(this)
    .then(function() {
      return this.getRefreshToken(request, client);
    })
    .tap(function(token) {
      return this.revokeToken(token);
    })
    .then(function(token) {
      return this.saveToken(token.user, client, token.scope);
    });
};

/**
 * Get refresh token.
 */

RefreshTokenGrantType.prototype.getRefreshToken = function(request, client) {
  if (!request.body.refresh_token) {
    throw new InvalidRequestError('Missing parameter: `refresh_token`');
  }

  if (!is.vschar(request.body.refresh_token)) {
    throw new InvalidRequestError('Invalid parameter: `refresh_token`');
  }

  return promisify(this.model.getRefreshToken, 1).call(this.model, request.body.refresh_token)
    .then(function(token) {
      if (!token) {
        throw new InvalidGrantError('Invalid grant: refresh token is invalid');
      }

      if (!token.client) {
        throw new ServerError('Server error: `getRefreshToken()` did not return a `client` object');
      }

      if (!token.user) {
        throw new ServerError('Server error: `getRefreshToken()` did not return a `user` object');
      }

      if (token.client.id !== client.id) {
        throw new InvalidGrantError('Invalid grant: refresh token is invalid');
      }

      if (token.refreshTokenExpiresAt && !(token.refreshTokenExpiresAt instanceof Date)) {
        throw new ServerError('Server error: `refreshTokenExpiresAt` must be a Date instance');
      }

      if (token.refreshTokenExpiresAt && token.refreshTokenExpiresAt < new Date()) {
        throw new InvalidGrantError('Invalid grant: refresh token has expired');
      }

      return token;
    });
};

/**
 * Revoke the refresh token.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-6
 */

RefreshTokenGrantType.prototype.revokeToken = function(token) {
  if (this.alwaysIssueNewRefreshToken === false) {
    return Promise.resolve(token);
  }

  return promisify(this.model.revokeToken, 1).call(this.model, token)
    .then(function(status) {
      if (!status) {
        throw new InvalidGrantError('Invalid grant: refresh token is invalid');
      }

      return token;
    });
};

/**
 * Save token.
 */

RefreshTokenGrantType.prototype.saveToken = function(user, client, scope) {
  var fns = [
    this.generateAccessToken(client, user, scope),
    this.generateRefreshToken(client, user, scope),
    this.getAccessTokenExpiresAt(),
    this.getRefreshTokenExpiresAt()
  ];

  return Promise.all(fns)
    .bind(this)
    .spread(function(accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt) {
      var token = {
        accessToken: accessToken,
        accessTokenExpiresAt: accessTokenExpiresAt,
        scope: scope
      };

      if (this.alwaysIssueNewRefreshToken !== false) {
        token.refreshToken = refreshToken;
        token.refreshTokenExpiresAt = refreshTokenExpiresAt;
      }

      return token;
    })
    .then(function(token) {
      return promisify(this.model.saveToken, 3).call(this.model, token, client, user)
        .then(function(savedToken) {
          return savedToken;
        });
    });
};

/**
 * Export constructor.
 */

module.exports = RefreshTokenGrantType;