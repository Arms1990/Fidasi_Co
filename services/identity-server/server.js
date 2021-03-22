const OAuth2Server = require('./lib/server');
const Request = require('./lib/request');
const Response = require('./lib/response');

const { OAuthEndUserAccessToken } = require('../database/models');

const oauth = new OAuth2Server({
    model: require('./config/model.js')
});

function authenticate(options) {
  return function(req, res, next) {
    const request = new Request({
      headers: {
        authorization: req.headers.authorization
      },
      method: req.method,
      query: req.query,
      body: req.body
    });
    const response = new Response(res);
    return oauth.authenticate(request, response, options || {})
      .then(function (token) {
        const { client, user, ...accessToken } = token;
        req.client = client;
        req.user = user;
        req.token = accessToken;
        return next();
      })
      .catch(function (err) {
        return res.status(err.code || 500).json(err)
      });
  }
}


function endUserAuthenticate(options) {
  return async function(req, res, next) {
    try {
      const token = req.headers.token;
      const accessToken = await OAuthEndUserAccessToken.query()
        .where('token', token)
        .where('active', true)
        .first();
  
      if(!accessToken) {
        throw new Error(`Invalid token.`);
      }
      req.customToken = token;
      return next();
    } catch(e) {
      return res.status(500).json({
        message: e.message
      });
    }
  }
}

module.exports = {
    authenticate,
    endUserAuthenticate,
    oauth
};