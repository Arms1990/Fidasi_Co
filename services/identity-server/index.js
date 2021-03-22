const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { oauth, authenticate } = require('./server');
const { User, UserScope, OAuthClient, OAuthEndUserAccessToken, OAuthAccessToken } = require('../database/models');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const { getUser, getAccessToken, getClient } = require('./config/model');
const argon2 = require('argon2');


const Request = require('./lib/request');
const Response = require('./lib/response');

const app = express();
const appName = process.env.APPLICATION_NAME;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: `*` //`${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.BACK_OFFICE_PORT}`
}));

const generateToken = async (req, res) => {
  try {
    const request = new Request(req);
    const response = new Response(res);
    return await oauth.token(request, response);
  } catch(error) {
    res.json(error);
  }
}


app.post('/oauth/verify/token', async function(req, res, next) {
  let isValid = false;
  const accessToken = await OAuthAccessToken.query()
    .where('access_token', req.body.token)
    .where('active', true)
    .where('expires', '>=', new Date())
    .first();
  if(accessToken) {
    const { token, access_token } = accessToken;
    const verificationHash = crypto
      .createHmac('sha256', process.env.SECRET_SIGNING_KEY)
      .update(token)
      .digest('hex');
    isValid = verificationHash === access_token;
  }
  return res.status(200).json({
    valid: isValid
  });
});


app.post('/oauth/end-user/token', async (req, res) => {
  try {
    const { token } = req.body;
    const accessToken = await OAuthEndUserAccessToken.query()
      .where('token', token)
      .where('active', true)
      .first();
    if(!accessToken) {
      throw new Error(`Invalid token.`);
    }
    const currentDate = new Date();
    const expiresDate = accessToken.expires;
    if(currentDate >= expiresDate) {
      throw new Error(`Token has expired.`);
    }
    return res.json({
      outcome: 'OK',
      user_id: accessToken.user_id,
      message: 'Token verified!'
    });
  } catch(e) {
    return res.status(500).json({
      outcome: 'KO',
      message: e.message
    });
  }
});

app.all('/oauth/token', async function(req, res, next) {

  const { username, password, client_id, client_secret, grant_type } = req.body;

  // let client = await OAuthClient.query()
  //   .where('client_id', client_id)
  //   .where('client_secret', client_secret)
  //   .first();

  // if(!client) {
  //   client = await OAuthClient.query().insert({
  //     client_id,
  //     client_secret,
  //     grant_types: grant_type
  //   });
  // }

  // let endUser = await User.query()
  //   .where('user_id', username)
  //   .first();

  // if(!endUser) {
  //   endUser = await User.query().insert({
  //     user_id: username,
  //     password: await argon2.hash(password),
  //     client_id: client.id
  //   });

  //   await UserScope.query().insert({
  //     user_id: endUser.id,
  //     scope: 'view menu'
  //   });
  // }

  const user = await getUser(username, password);

  if(!user.tfaEnabled) {
    const token = await generateToken(req, res);
    const user = token.user;
    delete user.tfaSecret;
    token.user = user;
    return res.json(token);
  }

  //TFA enabled
  const otpAuthURL = speakeasy.otpauthURL({
    secret: user.tfaSecret,
    label: appName,
    encoding: "base32"
  });


  return QRCode.toString(otpAuthURL, {
    type: "svg",
    width: 300,
    height: 300
  }, function (err, string) {
    if(err) {
      return console.error(err);
    }
    return res.json({
      "tfaEnabled": user.tfaEnabled,
      "qr": string
    });
  })







  //-------------------------------

  // return QRCode.toDataURL(otpAuthURL, (err, dataURL) => {
  //   return res.send(`<img src="${dataURL}" />`);
  // });

});

// app.get('/oauth/authorize', function(req, res) {
//   // Redirect anonymous users to login page.
//   if (!req.app.locals.user) {
//     return res.redirect(util.format('/login?redirect=%s&client_id=%s&redirect_uri=%s', req.path, req.query.client_id, req.query.redirect_uri));
//   }

//   return render('authorize', {
//     client_id: req.query.client_id,
//     redirect_uri: req.query.redirect_uri
//   });
// });

app.get('/example', function(req, res) {
  return res.send('Success!');
});

app.post('/oauth/authorise', function(req, res) {
  const request = new Request(req);
  const response = new Response(res);

  return oauth.authorize(request, response).then(function(success) {
      return res.json(success);
  }).catch(function(err){
    return res.status(err.code || 500).json(err)
  })
});



app.post('/tfa/scan-success', authenticate(), async (req, res) => {
  try {
    const user = User.query().findById(req.user.id);
    await user.patch({
      tfa_status: true
    });
    return res.json({
      message: `Two factor authentication has been turned on successfully.`
    });
  } catch(e) {
    return res.status(400).json({
      message: e.message || `An error occurred while turning on two-factor authentication.`
    });
  }
});


app.post('/tfa/remove', authenticate(), async (req, res) => {
  try {
    const user = User.query().findById(req.user.id);
    await user.patch({
      tfa_status: false,
      tfa_secret: null
    });
    return res.json({
      message: `Two factor authentication has been turned off successfully.`
    });
  } catch(e) {
    return res.status(400).json({
      message: e.message || `An error occurred while turning off two-factor authentication.`
    });
  }
});

app.post('/tfa/setup', authenticate(), async (req, res) => {

  const secret = speakeasy.generateSecret({
      name: appName,
      issuer: appName + ' v0.0'
  });
  
  const user = User.query().findById(req.user.id);

  await user.patch({
    // tfa_status: true,
    tfa_secret: secret.base32
  });


  return QRCode.toString(secret.otpauth_url, {
    type: "svg",
    width: 300,
    height: 300
  }, function (err, string) {
    if(err) {
      return console.error(err);
    }
    return res.send(string);
  })

  // QRCode.toDataURL(secret.otpauth_url, (err, dataURL) => {
  //     const tfa = {
  //         secret: '',
  //         tempSecret: secret.base32,
  //         dataURL,
  //         tfaURL: secret.otpauth_url
  //     };
  //     return res.send(`<img src="${dataURL}" />`);
  //     // return res.json({
  //     //     message: 'TFA Auth needs to be verified',
  //     //     tempSecret: secret.base32,
  //     //     dataURL,
  //     //     tfaURL: secret.otpauth_url
  //     // });
  // });
});


app.post('/tfa/verify', async (req, res, next) => {

  try {

    const user = await getUser(req.body.username, req.body.password);
    const otp = req.body.otp;
    
    const verified = speakeasy.totp.verify({
      secret: user.tfaSecret,
      encoding: 'base32',
      token: otp
    });
    
    if(!verified) {
      return res.status(400).json({
        message: "Could not verify the OTP."
      });
    }
  
    const token = await generateToken(req, res);
    const rawUser = token.user;
    delete rawUser.tfaSecret;
    token.user = rawUser;
    return res.json(token);
  
  } catch(error) {
    console.log(error);
  }

});


app.listen(process.env.IDENTITY_SERVER_PORT, () => {
  console.log(`OAuth 2.0 Server listening on *:${process.env.IDENTITY_SERVER_PORT}`);
});
