//AC add the manage of kafka
const { consumers, producers } = require( '../helpers/kafka');
const { FileUpload } = require('../database/models');
const { mailchimpClient } = require("../helpers/mail/mailchimp");

(async () => {

  await consumers.NewCustomersConsumer.connect();
  await consumers.NewCustomersConsumer.subscribe({
      topic: 'NewCustomers'
  });


  await consumers.NewCustomersConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        //Add the call of java
        const csvFilesPatch = await FileUpload.query()
            .patch({
                status:'5',
                return_code:'000'
            })
            .where('file_name', message.value.toString());
            if(!csvFilesPatch) {
              throw new Error(`An error on the update.`);
            }
    
      } catch(e) {
        console.log('Generic error',e);
      }
    }
  });

})();