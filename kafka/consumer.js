const { kafka } = require("../config/kafka");
const group = process.argv[2];

async function init() {
  const consumer = kafka.consumer({ groupId: group });

  console.log("Connecting Consumer...");
  await consumer.connect();
  console.log("Consumer Connected!");

  await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());

      console.log(`
  📬 Topic: ${topic}
  📦 Group: ${group}
  🧩 Partition: ${partition}
  🔑 Key: ${message.key?.toString()}
  📅 Timestamp: ${value.timestamp}
  🚴 Rider: ${value.name} from ${value.location}
  ==============================
      `);
    },
  });
}

init();
