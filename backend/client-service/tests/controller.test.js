const { listEvents, purchaseTicket } = require('../controllers/clientController');
const model = require('../models/clientModel');

jest.mock('../models/clientModel');

describe('clientController', () => {
  const res = { json: jest.fn(), status: jest.fn(() => res) };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should list all events successfully', async () => {
    const sampleEvents = [{ id: 1, name: 'Tiger Fest', ticketsAvailable: 42 }];
    model.getEvents.mockResolvedValue(sampleEvents);
    await listEvents({}, res, next);
    expect(res.json).toHaveBeenCalledWith(sampleEvents);
  });

  test('should handle error during listEvents()', async () => {
    const error = new Error('Database failure');
    model.getEvents.mockRejectedValue(error);
    await listEvents({}, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  test('should purchase a ticket successfully', async () => {
    model.purchaseOneTicket.mockResolvedValue(1);
    const req = { params: { id: '1' } };

    await purchaseTicket(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Ticket purchased successfully.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 for invalid event ID', async () => {
    const req = { params: { id: 'abc' } };

    await purchaseTicket(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return 404 when event not found', async () => {
    model.purchaseOneTicket.mockResolvedValue('NOT_FOUND');
    const req = { params: { id: '1' } };

    await purchaseTicket(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(404);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return 409 when event is sold out', async () => {
    model.purchaseOneTicket.mockResolvedValue('SOLD_OUT');
    const req = { params: { id: '1' } };

    await purchaseTicket(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(409);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should handle unexpected database error', async () => {
    const req = { params: { id: '1' } };
    const error = new Error('Unexpected failure');
    model.purchaseOneTicket.mockRejectedValue(error);

    await purchaseTicket(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
