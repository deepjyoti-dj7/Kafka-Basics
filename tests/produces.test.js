jest.mock("kafkajs");
const { Kafka } = require("kafkajs");

const mockSend = jest.fn();
Kafka.mockImplementation(() => ({
  producer: () => ({
    connect: jest.fn(),
    send: mockSend,
  }),
}));

describe("Kafka Producer", () => {
  it("should send a message to Kafka", async () => {
    const { kafka } = require("../client");

    const producer = kafka.producer();
    await producer.connect();

    await producer.send({
      topic: "rider-updates",
      messages: [
        {
          key: "location-update",
          value: JSON.stringify({ name: "John", location: "north" }),
        },
      ],
    });

    expect(mockSend).toHaveBeenCalled();
  });
});
