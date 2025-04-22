const { kafka } = require("./client");

async function init() {
  const admin = kafka.admin();

  console.log("Admin Connecting...");
  await admin.connect();
  console.log("Admin Connected!");

  console.log("Creating Topic [rider updates]");
  await admin.createTopics({
    topics: [
      {
        topic: "rider-updates",
        numPartitions: 2,
      },
    ],
  });
  console.log("Topic created successful! [rider updates]");

  console.log("Admin disconnecting...");
  await admin.disconnect();
  console.log("Admin Disconnected!");
}

init();
