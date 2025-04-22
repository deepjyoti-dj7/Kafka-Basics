const { kafka } = require("./client");
const group = process.argv[2];

async function init() {
  const consumer = kafka.consumer({ groupId: group });

  console.log("Connecting Consumer...");
  await consumer.connect();
  console.log("Consumer Connected!");

  await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `[${topic}] || [${group}] =====> 📩 Received message: ${message.value.toString()} (from Partition ${partition})`
      );
    },
  });
}

init();
