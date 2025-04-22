// tests/consumer.test.js

jest.mock("kafkajs");
jest.mock("../services/riderService"); // We'll spy on DB saving

const { Kafka } = require("kafkajs");
const { saveRiderUpdate } = require("../services/riderService");

const fakeConsumer = {
  connect: jest.fn(),
  subscribe: jest.fn(),
  run: jest.fn(),
};

Kafka.mockImplementation(() => ({
  consumer: () => fakeConsumer,
}));

const io = { emit: jest.fn() }; // fake socket.io instance

describe("Kafka Consumer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should consume a message and process it", async () => {
    const sampleMessage = {
      topic: "rider-updates",
      partition: 1,
      message: {
        value: Buffer.from(
          JSON.stringify({
            name: "Sam",
            location: "north",
            timestamp: new Date().toISOString(),
          })
        ),
      },
    };

    // Simulate consumer run callback
    fakeConsumer.run.mockImplementation(async ({ eachMessage }) => {
      await eachMessage(sampleMessage);
    });

    const { kafka } = require("../config/kafka");
    const consumer = kafka.consumer({ groupId: "test-group" });

    await consumer.connect();
    await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });
    await consumer.run({
      eachMessage: async (payload) => {
        const parsed = JSON.parse(payload.message.value.toString());
        const msg = {
          name: parsed.name,
          location: parsed.location,
          timestamp: parsed.timestamp,
          partition: payload.partition,
        };

        io.emit("rider-update", msg);
        await saveRiderUpdate(msg);
      },
    });

    expect(io.emit).toHaveBeenCalledWith(
      "rider-update",
      expect.objectContaining({ name: "Sam", location: "north" })
    );

    expect(saveRiderUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Sam", location: "north" })
    );
  });
});
