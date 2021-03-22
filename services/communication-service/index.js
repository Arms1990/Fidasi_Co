const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const mailchimp = require('@mailchimp/mailchimp_marketing');
const mailchimp = require("@mailchimp/mailchimp_transactional")('sVMqz0R2NOSKYGLfSLLTjw');

// mailchimp.setConfig({
//   apiKey: 'c417f8d0900e62d2e28b262c994266d9-us7', //process.env.MAILCHIMP_API_KEY
//   server: 'us7', //process.env.MAILCHIMP_SERVER_PREFIX
// });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: `${process.env.APPLICATION_PROTOCOL}://${process.env.APPLICATION_HOST}:${process.env.BACK_OFFICE_PORT}`
  })
);

// app.get('/', async (req, res) => {
//   // const response = await mailchimp.batchListMembers();
//   // console.log(response);
//   // return res.send(response);
// });

app.get('/', async (req, res) => {

  try {
    const message = {
      from_email: "levelnsrls@gmail.com",
      subject: "Hello world",
      text: "Welcome to Mailchimp Transactional!",
      to: [
        {
          email: "dawootee@gmail.com",
          type: "to"
        }
      ]
    };
    const response = await mailchimp.messages.send({ message });
    //console.log(response);
  } catch(e) {
    return res.status(400).json({
      message: e.message
    });
  }
});



app.listen(process.env.COMMUNICATION_SERVICE_PORT, () => {
  console.log(`Communication Service listening on *:${process.env.COMMUNICATION_SERVICE_PORT}`);
});