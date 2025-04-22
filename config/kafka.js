require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER],
});

module.exports = { kafka };
