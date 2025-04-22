const mockingoose = require("mockingoose");
const RiderUpdate = require("../models/RiderUpdate");

describe("DB Save Test", () => {
  it("should save a rider update", async () => {
    const mockData = {
      name: "Alice",
      location: "south",
      timestamp: new Date().toISOString(),
      partition: 1,
    };

    mockingoose(RiderUpdate).toReturn(mockData, "save");

    const saved = await RiderUpdate.create(mockData);

    expect(saved.name).toBe("Alice");
    expect(saved.location).toBe("south");
  });
});
