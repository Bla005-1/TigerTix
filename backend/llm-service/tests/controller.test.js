const { llmParse } = require('../controllers/llmController');
const model = require('../models/llmModel');

jest.mock('../models/llmModel');

describe('llmController', () => {
  const req = { body: 'Book two tickets for Football Game' };
  const res = { status: jest.fn(() => res), json: jest.fn() };
  const next = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test('returns parsed booking data when event found', async () => {
    model.getEvents.mockResolvedValue([{ id: 1, name: 'Football Game' }]);
    model.parseTextWithLLM.mockResolvedValue({
      event_id: 1,
      event: 'Football Game',
      tickets: '2',
    });

    await llmParse(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { event_id: 1, event: 'Football Game', tickets: '2' },
    });
  });

  test('throws 400 error when event not found', async () => {
    model.getEvents.mockResolvedValue([{ id: 1, name: 'Football Game' }]);
    model.parseTextWithLLM.mockResolvedValue({
      event: 'NOT_FOUND',
      tickets: 0,
    });

    await llmParse(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(400);
  });
});
