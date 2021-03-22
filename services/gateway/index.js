const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const argon2 = require('argon2');
const { getClientIp } = require('@supercharge/request-ip');
const ip6addr = require('ip6addr');
const { User, MenuItem, OAuthEndUserAccessToken, Address, PasswordReset, EndUser, EndUserPhoneNumber } = require("../database/models");
const { menuItemStatuses } = require("../database/enums");
const apiInternalFunctions = require("../helpers/api");
const { authenticate, endUserAuthenticate } = require("../identity-server/server");
const { layout, logger, addElaboration, endElaboration } = require("../helpers");
const countries = require("../helpers/countries.json");
const { mail } = require("../helpers/mail");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(
  (req, res, next) => {
    req.ip = getClientIp(req);
    next();
  }
);

app.use(
  cors({
    origin: `*` //`${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.BACK_OFFICE_PORT}`
  })
);


app.post('/forgot-password', async (req, res) => {
  try {
    const userId = req.body.user_id;
    const user = await User.query()
      .where('user_id', userId)
      .first();
    if(!user) {
      throw new Error(`No user found with the specified user ID.`);
    }
    const email = user.email_address;
    const oobCode = `${Math.random() * 100}`.replace(".", "");
    await mail(
      {
        email
      },
      {
        subject: 'Forgot Password Request',
        template: `
          <h5>Seems like you forgot your password?</h5>
          <p>Click here to <a href="${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.BACK_OFFICE_PORT}/user/reset-password?oobCode=${oobCode}">reset password.</a></p>
          <i>If you didn't make this request, you can safely discard this e-mail.</i>
          `
      }
    );
    const passwordReset = await PasswordReset.query()
      .insert({
        code: oobCode,
        user_id: user.id
      });
    if(!passwordReset) {
      throw new Error(`An error occurred while generating a reset password request.`);
    }
    return res.json({
      message: 'Please check your e-mail address to reset the password.'
    });
  } catch(e) {
    return res.status(400).json({
      message: e.message
    });
  }
});


app.post('/reset-password', async (req, res) => {
  try {
    const resetPasswordCode = req.body.resetPasswordCode;
    const newPassword = req.body.newPassword;
    const passwordReset = await PasswordReset.query()
      .where('code', resetPasswordCode)
      .where('completed', false)
      .orderBy('created_at', 'DESC')
      .first();
    if(!passwordReset) {
      throw new Error(`This code has been expired.`);
    }

    const user = await User.query()
      .patch({
        password: await argon2.hash(newPassword)
      })
      .where('id', passwordReset.user_id);

    if(!user) {
      throw new Error(`An error occurred while updating your password.`);
    }

    await PasswordReset.query()
      .patch({
        completed: true
      })
      .where('id', passwordReset.id);

    return res.json({
      message: 'Your password has been updated successfully. You can login with your new password now.'
    });
  } catch(e) {
    return res.status(400).json({
      message: e.message
    });
  }
});

app.get(
  "/menu",
  authenticate({
    roles: ["administrator"],
  }),
  async function (req, res) {
    try {
      const user = await User.query()
        .findById(req.user.id)
        .withGraphFetched("roles(selectId)")
        .modifiers({
          selectId(builder) {
            builder.select("roles.id");
          },
        });
      const userRoles = user.roles.map((role) => role.id);
      const menu = await MenuItem.query()
        .select("id", "name", "image", "priority")
        .where("client_id", user.client_id)
        .where("status", menuItemStatuses.A)
        .whereIn("role_id", userRoles)
        .whereNull("parent_id")
        .withGraphFetched(
          "[children(selectMenuItem).children(selectMenuItem), page(selectPage)]"
        )
        .modifiers({
          selectMenuItem(builder) {
            builder
              .select("id", "name", "image", "priority", "page_id")
              .withGraphFetched("page(selectPage)");
          },
          selectPage(builder) {
            builder.select(
              "id",
              "name",
              "slug",
              "description",
              "allowed_from",
              "status"
            );
          },
        });
      return res.status(200).json(menu);
    } catch (error) {
      console.log(error);
    }
  }
);

app.get("/details", authenticate(), layout());

app.post("/validateWizardStep", authenticate(), async function (req, res) {
  try {
    const otherData = { user: req.user };
    if(!apiInternalFunctions[req.body.action]) {
      return res.status(404).json({
        message: `The specified action wasn't found.`
      });
    }
    const { status, ...restResponse } = await apiInternalFunctions[
      req.body.action
    ](req.body, otherData);
    return res.status(status || 500).json(restResponse);
  } catch (error) {
    console.log(error);
  }
});


app.get("/countries", authenticate(), async (req, res) => {
  return res.json({ countries: countries.map( country => ({ name: country.name, code: country.alpha2Code }) ) });
});

app.post('/password', authenticate(), async (req, res) => {
  try {
    const { old_password, new_password, new_password_confirmation } = req.body;
    const user = await User.query().findById(req.user.id);
    if(!user) {
     throw new Error(`The user doesn't exist.`);
    }
    const oldPasswordVerification = await argon2.verify(user.password, old_password);
    if(!oldPasswordVerification) {
      throw new Error(`Incorrect old password.`);
    }
    if(new_password !== new_password_confirmation) {
      throw new Error(`The new passwords don't match with each other.`);
    }
    const update = await User.query()
      .where('id', req.user.id)
      .update({
        password: await argon2.hash(new_password),
      });
    if(!update) {
      throw new Error(`An error occurred while updating your password.`);
    }
    return res.json({
      message: 'The password has been updated successfully.'
    });
  } catch(e) {
    return res.status(400).json({
      message: e.message
    });
  }
});

app.post("/profile", authenticate(), async (req, res) => {

  try {
    const { first_name, last_name, email_address, user_id, addresses } = req.body;
    if(!first_name) {
      throw new Error(`First Name is required.`)
    }
    if(!last_name) {
      throw new Error(`Last Name is required.`)
    }
    if(!email_address) {
      throw new Error(`E-mail Address is required.`)
    }
    if(!user_id) {
      throw new Error(`User ID is required.`)
    }
    if(addresses) {
      addresses.forEach( address => {
        if(!address.address) {
          throw new Error(`Address is required for each address.`);
        }
        if(!address.city) {
          throw new Error(`City is required for each address.`);
        }
        if(!address.post_code) {
          throw new Error(`Post Code is required for each address.`);
        }
        if(!address.country) {
          throw new Error(`Country is required for each address.`);
        }
      })
    }
    await User.query()
      .where('id', req.user.id)
      .update({
        first_name,
        last_name,
        email_address,
        user_id
      });
    const user = await User.query().findById(req.user.id);
    let addressesMapped = [];
    if(addresses) {
      await Address.query()
        .where('user_id', req.user.id)
        .del();
      addressesMapped = addresses.map(
        address => ({
          address: address.address,
          city: address.city,
          post_code: address.post_code,
          country: address.country
        })
      );
      const userAddresses = await Address.query()
        .insert(addressesMapped.map( addressMapped => ({ ...addressMapped, user_id: req.user.id }) ));
      if(!userAddresses) {
        throw new Error(`An error occurred while saving your addresses.`);
      }
    }
    return res.status(200).json({
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        user_id: user.user_id,
        image: user.image,
        addresses: addresses ? addressesMapped : []
      }
    });
  } catch(e) {
    return res.status(500).json({
      message: e.message
    });
  }
});

app.post("/log", authenticate(), (req, res) => {
  try {
    logger.log({
      level: req.body.level || "info",
      message: req.body.message,
    });
    return res.status(204).send();
  } catch (e) {
    logger.log({
      level: "error",
      message: e.message,
    });
    return res.status(400).json({
      message: e.message,
    });
  }
});

app.post("/elaboration/:id/end", async (req, res) => {
  try {
    const elaboration = await endElaboration(req.params.id, 101);
    return res.status(200).json(elaboration);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
});

app.post("/elaboration", async (req, res) => {
  try {
    const elaboration = await addElaboration(
      "insert api",
      "Same process already in execution"
    );
    return res.status(200).json(elaboration);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
});

app.get('/user/:id', endUserAuthenticate(), async (req, res) => {
  try {
    const endUserId = req.params.id;
    const endUser = await EndUser.query()
      .findById(endUserId);
    if(!endUser) {
      throw new Error(`The user doesn't exist.`);
    }
    const phoneNumbers = await EndUserPhoneNumber.query()
      .where('user_id', endUserId);
    return res.json({
      user: {
        ...endUser,
        phoneNumbers
      }
    });
  } catch(e) {
    return res.status(400).json({
      message: e.message || `An error occurred while fetching details.`
    });
  }
});


app.post('/onboard/:id', endUserAuthenticate(), async (req, res) => {

  const endUserId = req.params.id;

  try {

    const ip_address = ip6addr.parse(req.ip).toString({
      format: 'v4'
    });

    const moa = req.body.moa;
    const name = req.body.first_name;
    const surname = req.body.surname;
    const telephone = req.body.telephone;
    const email = req.body.email;
    const tos_accepted = req.body.tos;


    if(!tos_accepted) {
      throw new Error(`Devi accettare i contenuti delle Condizioni Generali e della Privacy policy.`);
    }

    const endUserPhoneNumber = await EndUserPhoneNumber.query()
      .where('phone_number', telephone)
      .first();
  
    if(!endUserPhoneNumber) {
      throw new Error(`L'utente non esiste.`);
    }
  
    await EndUser.query()
      .patch({
        moa,
        name,
        surname,
        email,
        tos_accepted,
        ip_address,
        status: '3'
      })
      .where('id', endUserId);

    
      
    await OAuthEndUserAccessToken.query()
      .patch({
        active: false
      })
      .where('token', req.customToken);


    return res.json({
      message: `Onboarding completato con successo.`
    });

  } catch(e) {
    return res.status(400).json({
      message: e.message || `Si è verificato un errore durante il processo di onboarding.`
    });
  }
});

app.listen(process.env.GATEWAY_PORT, () => {
  console.log(`Gateway listening on *:${process.env.GATEWAY_PORT}`);
});