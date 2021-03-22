const { Kafka } = require('kafkajs');
const topics = require('./topics');

const kafkaServer = "kafka:9092";

const kafka = new Kafka({
    clientId: process.env.APPLICATION_NAME,
    brokers: [ kafkaServer ]
});

(async () => {
    const admin = kafka.admin();
    await admin.connect();
    try {
        await admin.fetchTopicMetadata({ topics: Object.values(topics).map( topic => topic.topic ) })
    } catch(e) {
        await admin.createTopics({
            validateOnly: false,
            waitForLeaders: true,
            topics: Object.values(topics),
        });
    }
    await admin.disconnect();
})();

module.exports = {
    kafka,
    kafkaServer
};  