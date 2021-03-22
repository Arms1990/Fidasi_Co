const { kafka } = require('../config');
const producer = kafka.producer();

producer.name = "TempCustomerProducer";

module.exports = producer;