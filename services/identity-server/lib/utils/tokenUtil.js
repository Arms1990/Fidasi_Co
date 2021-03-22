'use strict';

/**
 * Module dependencies.
 */

var crypto = require('crypto');
var randomBytes = require('bluebird').promisify(require('crypto').randomBytes);

/**
 * Export `TokenUtil`.
 */

module.exports = {

  generateRandomString: async function() {
    const buffer = await randomBytes(256);
    return buffer.toString('hex')
  },

  /**
   * Generate random token.
   */

  generateRandomToken: function(token) {
    return crypto
        .createHmac('sha256', process.env.SECRET_SIGNING_KEY)
        .update(token)
        .digest('hex');
  }

};
