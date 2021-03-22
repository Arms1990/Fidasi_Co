var _ = require('lodash');
var models = require('../../database/models');
var argon2 = require('argon2');

var User = models.User;
var OAuthClient = models.OAuthClient;
var OAuthAccessToken = models.OAuthAccessToken;
var OAuthAuthorizationCode = models.OAuthAuthorizationCode;
var OAuthRefreshToken = models.OAuthRefreshToken;


function getAccessToken(bearerToken) {
  return OAuthAccessToken.query()
    .select('access_token as accessToken', 'expires as accessTokenExpiresAt')
    .where('expires', '>=', new Date())
    .where('access_token', bearerToken)
    .where('active', true)
    .first()
    .withGraphFetched('[client.roles, user(selectUser).[roles, addresses]]')
    .modifiers({
      selectUser(builder) {
        builder.select('id', 'user_id', 'tfa_status', 'status', 'first_name', 'last_name', 'email_address', 'phone_number', 'client_id');
      }
    })
    .then(function (accessToken) {
      if (!accessToken) return false;
      var token = accessToken.toJSON();
      // token.client = token.client;
      // token.scope = token.scope;
      return token;
    })
    .catch(function (err) {
      console.log("getAccessToken - Err: ", err)
    });
}

function getClient(clientId, clientSecret) {
    const options = {
      client_id: clientId
    };
    if (clientSecret) options.client_secret = clientSecret;
    return OAuthClient.query()
      .select('id', 'client_id', 'grant_types as grants', 'redirect_uris')
      .findOne(options)
      .withGraphFetched('roles(selectRole)')
      .modifiers({
        selectRole(builder) {
          builder.select('roles.id', 'roles.name');
        }
      })
      .then(function (client) {
        if (!client) throw new Error("Client not found,");
        var clientWithGrants = client.toJSON()
        clientWithGrants.grants = clientWithGrants.grants.split(",").map( grant => grant.trim() ); //['authorization_code', 'password', 'refresh_token', 'client_credentials']
        // Todo: need to create another table for redirect URIs
        if(clientWithGrants.redirectUris) {
          clientWithGrants.redirectUris = clientWithGrants.redirect_uris.split(",").map( redirect_uri => redirect_uri.trim() );
        }
        // delete clientWithGrants.redirect_uri
        //clientWithGrants.refreshTokenLifetime = integer optional
        //clientWithGrants.accessTokenLifetime  = integer optional
        return clientWithGrants
      })
      .catch(function (err) {
        console.log("getClient - Err: ", err)
      });
}


function getUser(username, password) {
  return User.query()
    .select('id', 'user_id', 'first_name', 'last_name', 'email_address', 'password', 'user_created', 'client_id', 'image', 'phone_number', 'tfa_status as tfaEnabled', 'tfa_secret as tfaSecret')
    .findOne({
      user_id: username
    })
    .withGraphFetched('[roles(selectRole), addresses(selectAddress)]')
    .modifiers({
      selectRole(builder) {
        builder.select('roles.id', 'roles.name', 'roles.access_bo');
      },
      selectAddress(builder) {
        builder.select('addresses.id', 'addresses.address', 'addresses.city', 'addresses.post_code', 'addresses.country')
      }
    })
    .then(async function (user) {
      const verification = await argon2.verify(user.password, password);
      if(!verification) {
        throw new Error("Incorrect password.");
      }
      const { roles, addresses, password: userPassword, ...realUser } = user.toJSON();      
      return {
        ...realUser,
        roles,
        addresses
      };
    })
    .catch(function (err) {
      console.log("getUser - Err: ", err);
      return false;
    });
}

function revokeAuthorizationCode(code) {
  return OAuthAuthorizationCode.query()
    .where('authorization_code', code)
    .then(function (rCode) {
      if(rCode) rCode.destroy();
      /***
       * As per the discussion we need set older date
       * revokeToken will expected return a boolean in future version
       * https://github.com/oauthjs/node-oauth2-server/pull/274
       * https://github.com/oauthjs/node-oauth2-server/issues/290
      */
    const expiredCode = code;
    expiredCode.expiresAt = new Date('2015-05-28T06:59:53.000Z')
    return expiredCode;
  }).catch(function (err) {
    console.log("getUser - Err: ", err)
  });
}

function revokeToken(token) {
  return OAuthRefreshToken.findOne({
    where: {
      refresh_token: token.refreshToken
    }
  }).then(function (rT) {
    if (rT) rT.destroy();
    /***
     * As per the discussion we need set older date
     * revokeToken will expected return a boolean in future version
     * https://github.com/oauthjs/node-oauth2-server/pull/274
     * https://github.com/oauthjs/node-oauth2-server/issues/290
     */
    var expiredToken = token
    expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000Z')
    return expiredToken
  }).catch(function (err) {
    console.log("revokeToken - Err: ", err)
  });
}


async function saveToken(token, client, user) {
  try {
    const previousAccessTokens = await OAuthAccessToken.query()
      .select('id')
      .where('client_id', client.id)
      .where('user_id', user.id);

    const accessTokenIds = previousAccessTokens.map( previousAccessToken => previousAccessToken.id );

    await OAuthAccessToken.query()
      .whereIn('id', accessTokenIds)
      .del();

    await OAuthRefreshToken.query()
      .whereIn('access_token_id', accessTokenIds)
      .update({
        active: false
      });

    const accessToken = await OAuthAccessToken.query().insert({
      token: token.accessToken.token,
      access_token: token.accessToken.encryptedToken,
      expires: token.accessTokenExpiresAt,
      client_id: client.id,
      user_id: user.id,
      active: true,
      activated_at: new Date(),
      scope: token.scope
    });

    const refreshToken = token.refreshToken ? await OAuthRefreshToken.query().insert({ // no refresh token for client_credentials
        refresh_token: token.refreshToken,
        expires: token.refreshTokenExpiresAt,
        client_id: client.id,
        user_id: user.id,
        access_token_id: accessToken.id,
        scope: token.scope
      }) : [];

    return {
      tfaEnabled: user.tfaEnabled,
      // client: {
      //   id: client.id,
      //   scopes: client.scopes.map( scope => scope.scope )
      // },
      user,
      accessToken: token.accessToken.encryptedToken,
      refreshToken: token.refreshToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt
    }
  } catch(err) {
    console.log("saveToken - Err: ", err)
  }
}

function getAuthorizationCode(code) {


  return OAuthAuthorizationCode.query()
    .select('client_id', 'expires', 'user_id', 'scope')
    .where('authorization_code', code)
    .first()
    .withGraphFetched('[client, user(selectUser)]')
    .modifiers({
      selectUser(builder) {
        builder.select('id', 'user_id', 'tfa_status', 'status');
      }
    })
    .then(function (authCodeModel) {
      if (!authCodeModel) return false;
      const client = authCodeModel.client.toJSON();
      const user = authCodeModel.user.toJSON();
      return reCode = {
        code: code,
        client: client,
        expiresAt: authCodeModel.expires,
        redirectUri: client.redirect_uri,
        user: user,
        scope: authCodeModel.scope
      };
    })
    .catch(function (err) {
      console.log("getAuthorizationCode - Err: ", err)
    });
}

function saveAuthorizationCode(code, client, user) {
  return OAuthAuthorizationCode.query()
    .insert({
      expires: code.expiresAt,
      client_id: client.id,
      authorization_code: code.authorizationCode,
      user_id: user.id,
      redirect_uris: client.redirect_uris,
      scope: code.scope
    })
    .then(function () {
      const { authorizationCode, ...restAuthorizationCode } = code;
      return {
        code: authorizationCode,
        ...restAuthorizationCode
      };
    })
    .catch(function (err) {
      console.log("saveAuthorizationCode - Err: ", err)
    });
}

function getUserFromClient(client) {
  // var options = {
  //   where: {client_id: client.client_id},
  //   include: [User],
  //   attributes: ['id', 'client_id', 'redirect_uri'],
  // };
  // if (client.client_secret) options.where.client_secret = client.client_secret;


  try {
    let client = OAuthClient.query()
      .select('client_id', 'redirect_uri');
    if (client.client_secret) {
      client.where('client_secret', client.client_secret);
    }
    return client.findById(client.id)
      .withGraphFetched('[user(selectUser)]')
      .modifiers({
        selectUser(builder) {
          builder.select('id', 'user_id', 'tfa_status', 'status');
        }
      })
      .then( client => {
        if (!client) return false;
        if (!client.user) return false;
        return client.user.toJSON();
      });
  } catch(error) {
    console.log("getUserFromClient - Err: ", error);
  }
}

function getRefreshToken(refreshToken) {
  if (!refreshToken || refreshToken === 'undefined') return false

  return OAuthRefreshToken
    .findOne({
      attributes: ['client_id', 'user_id', 'expires'],
      where: {refresh_token: refreshToken},
      include: [OAuthClient, User]

    })
    .then(function (savedRT) {
      var tokenTemp = {
        user: savedRT ? savedRT.User.toJSON() : {},
        client: savedRT ? savedRT.OAuthClient.toJSON() : {},
        refreshTokenExpiresAt: savedRT ? new Date(savedRT.expires) : null,
        refreshToken: refreshToken,
        refresh_token: refreshToken,
        scope: savedRT.scope
      };
      return tokenTemp;

    }).catch(function (err) {
      console.log("getRefreshToken - Err: ", err)
    });
}

function validateScope(user, client, scope) {
  return client.id == user.client_id;
}

function verifyScope(token, roles) {
  const clientScopes = token.client.roles.map( role => role.name );
  return roles.every( role => clientScopes.includes(role) );
}

module.exports = {
  // generateOAuthAccessToken, //optional - used for jwt
  // generateAuthorizationCode, //optional
  //generateOAuthRefreshToken, - optional
  getAccessToken: getAccessToken,
  getAuthorizationCode: getAuthorizationCode, //getOAuthAuthorizationCode renamed to,
  getClient: getClient,
  getRefreshToken: getRefreshToken,
  getUser: getUser,
  getUserFromClient: getUserFromClient,
  //grantTypeAllowed, Removed in oauth2-server 3.0
  revokeAuthorizationCode: revokeAuthorizationCode,
  revokeToken: revokeToken,
  saveToken: saveToken,//saveOAuthAccessToken, renamed to
  saveAuthorizationCode: saveAuthorizationCode, //renamed saveOAuthAuthorizationCode,
  validateScope: validateScope,
  verifyScope: verifyScope,
}