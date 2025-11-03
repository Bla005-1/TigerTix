const { getEvents, addEvent, updateEvent } = require('../models/adminModel');
jest.mock('../../shared-db/setup', () => ({
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
}));

const db = require('../../shared-db/setup');

describe('adminModel', () => {
  beforeEach(() => jest.clearAllMocks());

  test('should fetch all events from the database', async () => {
    db.all.mockResolvedValue([
      { id: 1, name: 'Concert', tickets_available: 42 },
      { id: 2, name: 'Play', tickets_available: 15 },
    ]);
    const events = await getEvents();
    expect(events).toEqual([
      { id: 1, name: 'Concert', tickets_available: 42 },
      { id: 2, name: 'Play', tickets_available: 15 },
    ]);
  });

  test('should return empty array if no events exist', async () => {
    db.all.mockResolvedValue(undefined);
    const events = await getEvents();
    expect(events).toEqual([]);
  });

  test('should successfully add event', async () => {
    const jsonObject = {
        "name":"cheese91",
        "date":"2025-09",
        "tickets_available":90
    }
    db.run.mockResolvedValue({ changes: 1 });
    const result = await addEvent(jsonObject);
    expect(result.changes).toBe(1);
  });

  test('should successfully update event', async () => {
    const jsonObject = {
        "id": 1,
        "name":"cheese91",
        "date":"2025-09",
        "tickets_available":90
    }
    db.run.mockResolvedValue({ changes: 1 });
    const result = await updateEvent(jsonObject);
    expect(result.changes).toBe(1);
  });

  test('should handle database error gracefully', async () => {
    const error = new Error('DB failure');
    db.all.mockRejectedValue(error);
    await expect(getEvents()).rejects.toBe(error);
  });
});
