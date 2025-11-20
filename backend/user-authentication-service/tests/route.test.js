const express = require('express');
const router = require('../routes/authRoutes');
const controller = require('../controllers/authController');

jest.mock('../controllers/authController', () => ({
  registerUser: jest.fn((req, res) => res.json({ ok: true })),
  loginUser: jest.fn((req, res) => res.json({ token: 'abc' })),
}));

describe('authRoutes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/auth', router);
  });

  test('should have POST /auth/register route', () => {
    const routeLayer = router.stack.find(
      (layer) =>
        layer.route &&
        layer.route.path === '/register' &&
        layer.route.methods.post
    );

    expect(routeLayer).toBeDefined();
    expect(
      routeLayer.route.stack.some((s) => s.handle === controller.registerUser)
    ).toBe(true);
  });

  test('should have POST /auth/login route', () => {
    const routeLayer = router.stack.find(
      (layer) =>
        layer.route &&
        layer.route.path === '/login' &&
        layer.route.methods.post
    );

    expect(routeLayer).toBeDefined();
    expect(
      routeLayer.route.stack.some((s) => s.handle === controller.loginUser)
    ).toBe(true);
  });
});
