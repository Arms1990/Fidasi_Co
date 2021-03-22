'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var BearerTokenType = require('../tokenTypes/bearerTokenType');
var InvalidArgumentError = require('../errors/invalidArgumentError');
var InvalidClientError = require('../errors/invalidClientError');
var InvalidRequestError = require('../errors/invalidRequestError');
var OAuthError = require('../errors/oauthError');
var Promise = require('bluebird');
var promisify = require('promisify-any').use(Promise);
var Request = require('../request');
var Response = require('../response');
var ServerError = require('../errors/serverError');
var TokenModel = require('../models/tokenModel');
var UnauthorizedClientError = require('../errors/unauthorizedClientError');
var UnsupportedGrantTypeError = require('../errors/unsupportedGrantTypeError');
var auth = require('basic-auth');
var is = require('../validator/is');

/**
 * Grant types.
 */

var grantTypes = {
  authorization_code: require('../grantTypes/authorizationCodeGrantType'),
  client_credentials: require('../grantTypes/clientCredentialsGrantType'),
  password: require('../grantTypes/passwordGrantType'),
  refresh_token: require('../grantTypes/refreshTokenGrantType')
};

/**
 * Constructor.
 */

function TokenHandler(options) {
  options = options || {};

  if (!options.accessTokenLifetime) {
    throw new InvalidArgumentError('Missing parameter: `accessTokenLifetime`');
  }

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }

  if (!options.refreshTokenLifetime) {
    throw new InvalidArgumentError('Missing parameter: `refreshTokenLifetime`');
  }

  if (!options.model.getClient) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getClient()`');
  }

  this.accessTokenLifetime = options.accessTokenLifetime;
  this.grantTypes = _.assign({}, grantTypes, options.extendedGrantTypes);
  this.model = options.model;
  this.refreshTokenLifetime = options.refreshTokenLifetime;
  this.allowExtendedTokenAttributes = options.allowExtendedTokenAttributes;
  this.requireClientAuthentication = options.requireClientAuthentication || {};
  this.alwaysIssueNewRefreshToken = options.alwaysIssueNewRefreshToken !== false;
}

/**
 * Token Handler.
 */

TokenHandler.prototype.handle = function(request, response) {
  if (!(request instanceof Request)) {
    throw new InvalidArgumentError('Invalid argument: `request` must be an instance of Request');
  }

  if (!(response instanceof Response)) {
    throw new InvalidArgumentError('Invalid argument: `response` must be an instance of Response');
  }

  if (request.method !== 'POST') {
    return Promise.reject(new InvalidRequestError('Invalid request: method must be POST'));
  }

  if (!request.is('application/x-www-form-urlencoded')) {
    return Promise.reject(new InvalidRequestError('Invalid request: content must be application/x-www-form-urlencoded'));
  }


  return Promise.bind(this)
    .then(function() {
      return this.getClient(request, response);
    })
    .then(async function(client) {
      return await this.handleGrantType(request, client);
    })
    .tap(function(data) {
      var model = new TokenModel(data, {allowExtendedTokenAttributes: this.allowExtendedTokenAttributes});
      var tokenType = this.getTokenType(model);
      this.updateSuccessResponse(response, tokenType);
    }).catch(function(e) {
      if (!(e instanceof OAuthError)) {
        e = new ServerError(e);
      }

      this.updateErrorResponse(response, e);

      throw e;
    });
};

/**
 * Get the client from the model.
 */

TokenHandler.prototype.getClient = function(request, response) {
  var credentials = this.getClientCredentials(request);
  var grantType = request.body.grant_type;

  if (!credentials.clientId) {
    throw new InvalidRequestError('Missing parameter: `client_id`');
  }

  if (this.isClientAuthenticationRequired(grantType) && !credentials.clientSecret) {
    throw new InvalidRequestError('Missing parameter: `client_secret`');
  }

  if (!is.vschar(credentials.clientId)) {
    throw new InvalidRequestError('Invalid parameter: `client_id`');
  }

  if (credentials.clientSecret && !is.vschar(credentials.clientSecret)) {
    throw new InvalidRequestError('Invalid parameter: `client_secret`');
  }

  return promisify(this.model.getClient, 2).call(this.model, credentials.clientId, credentials.clientSecret)
    .then(function(client) {
      if (!client) {
        throw new InvalidClientError('Invalid client: client is invalid');
      }

      if (!client.grants) {
        throw new ServerError('Server error: missing client `grants`');
      }

      if (!(client.grants instanceof Array)) {
        throw new ServerError('Server error: `grants` must be an array');
      }

      return client;
    })
    .catch(function(e) {
      // Include the "WWW-Authenticate" response header field if the client
      // attempted to authenticate via the "Authorization" request header.
      //
      // @see https://tools.ietf.org/html/rfc6749#section-5.2.
      if ((e instanceof InvalidClientError) && request.get('authorization')) {
        response.set('WWW-Authenticate', 'Basic realm="Service"');

        throw new InvalidClientError(e, { code: 401 });
      }

      throw e;
    });
};

/**
 * Get client credentials.
 *
 * The client credentials may be sent using the HTTP Basic authentication scheme or, alternatively,
 * the `client_id` and `client_secret` can be embedded in the body.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-2.3.1
 */

TokenHandler.prototype.getClientCredentials = function(request) {
  var credentials = auth(request);
  var grantType = request.body.grant_type;

  if (credentials) {
    return { clientId: credentials.name, clientSecret: credentials.pass };
  }

  if (request.body.client_id && request.body.client_secret) {
    return { clientId: request.body.client_id, clientSecret: request.body.client_secret };
  }

  if (!this.isClientAuthenticationRequired(grantType)) {
    if(request.body.client_id) {
      return { clientId: request.body.client_id };
    }
  }

  throw new InvalidClientError('Invalid client: cannot retrieve client credentials');
};

/**
 * Handle grant type.
 */

TokenHandler.prototype.handleGrantType = async function(request, client) {
  var grantType = request.body.grant_type;

  if (!grantType) {
    throw new InvalidRequestError('Missing parameter: `grant_type`');
  }

  if (!is.nchar(grantType) && !is.uri(grantType)) {
    throw new InvalidRequestError('Invalid parameter: `grant_type`');
  }

  if (!_.has(this.grantTypes, grantType)) {
    throw new UnsupportedGrantTypeError('Unsupported grant type: `grant_type` is invalid');
  }

  if (!_.includes(client.grants, grantType)) {
    throw new UnauthorizedClientError('Unauthorized client: `grant_type` is invalid');
  }

  var accessTokenLifetime = this.getAccessTokenLifetime(client);
  var refreshTokenLifetime = this.getRefreshTokenLifetime(client);
  var Type = this.grantTypes[grantType];

  var options = {
    accessTokenLifetime: accessTokenLifetime,
    model: this.model,
    refreshTokenLifetime: refreshTokenLifetime,
    alwaysIssueNewRefreshToken: this.alwaysIssueNewRefreshToken
  };

  return await new Type(options)
    .handle(request, client);
};

/**
 * Get access token lifetime.
 */

TokenHandler.prototype.getAccessTokenLifetime = function(client) {
  return client.accessTokenLifetime || this.accessTokenLifetime;
};

/**
 * Get refresh token lifetime.
 */

TokenHandler.prototype.getRefreshTokenLifetime = function(client) {
  return client.refreshTokenLifetime || this.refreshTokenLifetime;
};

/**
 * Get token type.
 */

TokenHandler.prototype.getTokenType = function(model) {
  return new BearerTokenType(model.accessToken, model.accessTokenLifetime, model.refreshToken, model.scope, model.customAttributes);
};

/**
 * Update response when a token is generated.
 */

TokenHandler.prototype.updateSuccessResponse = function(response, tokenType) {
  response.body = tokenType.valueOf();
  response.set('Cache-Control', 'no-store');
  response.set('Pragma', 'no-cache');
};

/**
 * Update response when an error is thrown.
 */

TokenHandler.prototype.updateErrorResponse = function(response, error) {
  response.body = {
    error: error.name,
    error_description: error.message
  };

  response.status = error.code;
};

/**
 * Given a grant type, check if client authentication is required
 */
TokenHandler.prototype.isClientAuthenticationRequired = function(grantType) {
  if (Object.keys(this.requireClientAuthentication).length > 0) {
    return (typeof this.requireClientAuthentication[grantType] !== 'undefined') ? this.requireClientAuthentication[grantType] : true;
  } else {
    return true;
  }
};

/**
 * Export constructor.
 */

module.exports = TokenHandler;