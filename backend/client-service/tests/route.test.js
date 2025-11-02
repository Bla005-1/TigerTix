const express = require('express');
const router = require('../routes/clientRoutes');
const controller = require('../controllers/clientController');

jest.mock('../controllers/clientController', () => ({
  listEvents: jest.fn((req, res) => res.json([])),
  purchaseTicket: jest.fn((req, res) => res.json({ success: true })),
}));

describe('clientRoutes', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/api', router);
  });

  test('should have GET /api/events route', () => {
    const getEventsLayer = router.stack.find(
      (layer) => layer.route && layer.route.path === '/events' && layer.route.methods.get
    );
    expect(getEventsLayer).toBeDefined();
    const handlerAssigned = getEventsLayer.route.stack.some(
      (stackItem) => stackItem.handle === controller.listEvents
    );
    expect(handlerAssigned).toBe(true);
  });

  test('should have POST /api/events/:id/purchase route', () => {
    const postPurchaseLayer = router.stack.find(
      (layer) =>
        layer.route &&
        layer.route.path === '/events/:id/purchase' &&
        layer.route.methods.post
    );
    expect(postPurchaseLayer).toBeDefined();
    const handlerAssigned = postPurchaseLayer.route.stack.some(
      (stackItem) => stackItem.handle === controller.purchaseTicket
    );
    expect(handlerAssigned).toBe(true);
  });

});
