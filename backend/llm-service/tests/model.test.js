const { getEvents, parseTextWithLLM } = require('../models/llmModel');
const db = require('../../shared-db/setup');
jest.mock('../../shared-db/setup');
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: JSON.stringify({
          event_id: 1,
          event: 'Football Game',
          tickets: '2',
        }),
      }),
    },
  })),
  Type: { OBJECT: 'object', STRING: 'string' },
}));

describe('llmModel', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getEvents returns rows from DB', async () => {
    db.all.mockResolvedValue([{ id: 1, name: 'Football Game' }]);
    const result = await getEvents();
    expect(result).toEqual([{ id: 1, name: 'Football Game' }]);
  });

  test('parseTextWithLLM returns structured object', async () => {
    const text = 'Book two tickets for Football Game';
    const events = JSON.stringify([{ id: 1, name: 'Football Game' }]);
    const result = await parseTextWithLLM(text, events);
    expect(result).toEqual({
      event_id: 1,
      event: 'Football Game',
      tickets: '2',
    });
  });
});
