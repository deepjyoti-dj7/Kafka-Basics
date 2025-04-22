const { kafka } = require("./client");

async function init() {
  const admin = kafka.admin();

  console.log("Admin Connecting...");
  await admin.connect();
  console.log("Admin Connected!");

  console.log("Creating Topic [rider updates]");
  const existingTopics = await admin.listTopics();

  if (!existingTopics.includes("rider-updates")) {
    console.log("Creating Topic [rider-updates]...");
    await admin.createTopics({
      topics: [
        {
          topic: "rider-updates",
          numPartitions: 2,
        },
      ],
    });
    console.log("✅ Topic created: rider-updates");
  } else {
    console.log("⚠️ Topic [rider-updates] already exists.");
  }

  console.log("Admin disconnecting...");
  await admin.disconnect();
  console.log("Admin Disconnected!");
}

init();
