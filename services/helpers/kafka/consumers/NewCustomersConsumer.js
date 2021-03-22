const { kafka } = require('../config');

//const consumer = kafka.consumer({ groupId: 'NewCustomers' });
const consumer = kafka.consumer({ groupId: 'NewCustomers1' });
consumer.name = "NewCustomersConsumer";

module.exports = consumer;