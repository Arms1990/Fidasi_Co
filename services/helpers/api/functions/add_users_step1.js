const { resolveHostname } = require('nodemailer/lib/shared');
const { FileUpload } = require('../../../database/models');
const { producers } = require( '../../kafka');

module.exports = add_users_step1 = async (body) => {

    try {
        const { data } = body;

        var contract_input = data.contract;
                //const contract_input = data.contract.map(contract =>  contract.value);
       
        data.csv.forEach( csvFile => {
            if(!csvFile.endsWith(".csv")) {
                throw new Error(`You can only upload CSV files.`);
            }
        })

        const csvFiles = await FileUpload.query()
            .insert(
                data.csv.map( csvFile => {
                    return {
                        file_name: csvFile,
                        user_id: body.user_id,
                        status:'4',
                        path: `storage/uploads/${csvFile}`,
                        //type_contract: parseInt(contract_input[0],10)
                        type_contract: contract_input
                    };
                    
                })
            );
        if(!csvFiles) {
            throw new Error(`An error occurred while uploading file.`);
        }
        //Ac write on kafka que
        var filename_rec = csvFiles.map(async obj =>{
            const payloads = [
                {
                  topic: 'NewCustomers',
                  messages: [
                    { value: obj.file_name }
                  ]
                }
              ];
              await producers.TempCustomerProducer.connect();
              await producers.TempCustomerProducer.sendBatch({ topicMessages: payloads });
    
        });    
        return {
            status: 200,
            outcome: 'OK',
            data: body.data
        };
    } catch(e) {
        return {
            status: 400,
            outcome: 'KO',
            message: e.message || `An error occurred while uploading file.`
        };
    }
}
