const { getEvents, purchaseOneTicket } = require('../models/clientModel');
jest.mock('../../shared-db/setup', () => ({
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
}));

const db = require('../../shared-db/setup');

describe('clientModel', () => {
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

  test('should successfully decrement ticket count', async () => {
    db.run.mockResolvedValue({ changes: 1 });
    const eventId = 5;
    const result = await purchaseOneTicket(eventId);
    expect(result).toBe(eventId);
  });

  test('should detect sold-out event', async () => {
    db.run.mockResolvedValue({ changes: 0 });
    db.get.mockResolvedValue({ tickets_available: 0 });
    const eventId = 7;
    const result = await purchaseOneTicket(eventId);
    expect(result).toBe('SOLD_OUT');
    expect(db.run).toHaveBeenCalledWith(
      'UPDATE events SET tickets_available = tickets_available - 1 WHERE id = ? AND tickets_available > 0;',
      [eventId]
    );
    expect(db.get).toHaveBeenCalledWith(
      'SELECT tickets_available FROM events WHERE id = ?;',
      [eventId]
    );
  });

  test('should detect non-existent event', async () => {
    const eventId = 11;
    db.run.mockResolvedValue({ changes: 0 });
    db.get.mockResolvedValue(undefined);
    const result = await purchaseOneTicket(eventId);
    expect(result).toBe('NOT_FOUND');
    expect(db.run).toHaveBeenCalledWith(
      'UPDATE events SET tickets_available = tickets_available - 1 WHERE id = ? AND tickets_available > 0;',
      [eventId]
    );
    expect(db.get).toHaveBeenCalledWith(
      'SELECT tickets_available FROM events WHERE id = ?;',
      [eventId]
    );
  });

  test('should handle database error gracefully', async () => {
    const error = new Error('DB failure');
    db.all.mockRejectedValue(error);
    await expect(getEvents()).rejects.toBe(error);
  });
});
