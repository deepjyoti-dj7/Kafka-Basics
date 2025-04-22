const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["192.168.1.2:9092"], // Your Kafka broker IP
});

module.exports = { kafka };
