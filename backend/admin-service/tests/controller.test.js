const { listEvents, newEvent, patchEvent } = require('../controllers/adminController');
const model = require('../models/adminModel');

jest.mock('../models/adminModel');

describe('adminController', () => {
  let res;
  let next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('should list all events successfully', async () => {
    const events = [{ id: 1, name: 'Tiger Fest', tickets_available: 42 }];
    model.getEvents.mockResolvedValue(events);

    await listEvents({}, res, next);

    expect(model.getEvents).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(events);
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle error during listEvents()', async () => {
    const error = new Error('Database failure');
    model.getEvents.mockRejectedValue(error);

    await listEvents({}, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should add a new event when payload is valid', async () => {
    const body = {
      name: 'Cheese Fest',
      date: '2025-09-01',
      tickets_available: 90,
    };
    model.addEvent.mockResolvedValue({ id: 3 });

    const result = await newEvent({ body }, res, next);

    expect(model.addEvent).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('200: Successfully Added Event');
    expect(next).not.toHaveBeenCalled();
    expect(result).toEqual({ id: 3 });
  });

  test('should surface validation error for missing fields in new event', async () => {
    await newEvent({ body: { name: 'Incomplete Event' } }, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  test('should handle unexpected addEvent error', async () => {
    const body = {
      name: 'Cheese Fest',
      date: '2025-09-01',
      tickets_available: 90,
    };
    const error = new Error('Unexpected failure');
    model.addEvent.mockRejectedValue(error);

    await newEvent({ body }, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalledWith(200);
    expect(res.send).not.toHaveBeenCalled();
  });

  test('should propagate updateEvent errors', async () => {
    const body = {
      id: 1,
      name: 'Broken Event',
      date: '2025-09-01',
      tickets_available: 10,
    };
    const error = new Error('DB down');
    model.updateEvent.mockRejectedValue(error);

    await patchEvent({ body }, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalledWith(200);
    expect(res.send).not.toHaveBeenCalled();
  });
});
