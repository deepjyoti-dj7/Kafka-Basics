const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { kafka } = require("../config/kafka");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("../public"));

const consumer = kafka.consumer({ groupId: "dashboard-group" });

const RiderUpdate = require("../models/RiderUpdate");

// ========== MongoDB Connection ==========
const connectDB = require("../config/db");
connectDB();
// ========================================

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const parsed = JSON.parse(message.value.toString());

      const msg = {
        name: parsed.name,
        location: parsed.location,
        timestamp: parsed.timestamp,
        partition,
      };

      // Emit to frontend
      io.emit("rider-update", msg);

      // Save to DB
      try {
        const saved = await RiderUpdate.create(msg);
        console.log("💾 Saved to DB:", saved.name);
      } catch (err) {
        console.error("❌ DB Save Error:", err.message);
      }
    },
  });

  console.log("📊 Dashboard consumer running...");
};

run().catch(console.error);

server.listen(3000, () => {
  console.log("🚀 Dashboard live at http://localhost:3000");
});
