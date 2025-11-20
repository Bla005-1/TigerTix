const { registerUser, loginUser, verifyUser } = require('../controllers/authController');
const model = require('../models/authModel');

jest.mock('../models/authModel');

describe('authController', () => {
  const res = { json: jest.fn(), status: jest.fn(() => res) };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should register a new user successfully', async () => {
    model.getUser.mockResolvedValue('NOT_FOUND');
    model.generateHash.mockResolvedValue('hashed_pw');
    model.storeUser.mockResolvedValue({ id: 1 });

    const req = { body: { user_name: 'test', password: 'pw' } };
    await registerUser(req, res, next);

    expect(model.getUser).toHaveBeenCalledWith('test');
    expect(model.storeUser).toHaveBeenCalledWith('test', 'hashed_pw');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(req.body);
    expect(next).not.toHaveBeenCalled();
  });

  test('should block registration for duplicate username', async () => {
    model.getUser.mockResolvedValue({ user_name: 'test' });

    const req = { body: { user_name: 'test', password: 'pw' } };
    await registerUser(req, res, next);

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
  });

  test('should handle registration failure', async () => {
    model.getUser.mockResolvedValue('NOT_FOUND');
    model.generateHash.mockResolvedValue('hashed_pw');
    model.storeUser.mockResolvedValue(undefined);

    const req = { body: { user_name: 'test', password: 'pw' } };
    await registerUser(req, res, next);

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(500);
  });

  test('should log in user successfully', async () => {
    model.getHash.mockResolvedValue('stored_hash');
    model.validatePassword.mockResolvedValue(true);
    model.generateJWT.mockResolvedValue('fake.jwt.token');

    const req = { body: { user_name: 'test', password: 'pw' } };
    await loginUser(req, res, next);

    expect(model.validatePassword).toHaveBeenCalledWith('pw', 'stored_hash');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'fake.jwt.token' });
  });

  test('should reject login if hash is not found', async () => {
    model.getHash.mockResolvedValue(undefined);

    const req = { body: { user_name: 'test', password: 'pw' } };
    await loginUser(req, res, next);

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(500);
  });

  test('should reject invalid password', async () => {
    model.getHash.mockResolvedValue('stored_hash');
    model.validatePassword.mockResolvedValue(false);

    const req = { body: { user_name: 'test', password: 'pw' } };
    await loginUser(req, res, next);

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
  });

  test('should handle token creation error', async () => {
    model.getHash.mockResolvedValue('stored_hash');
    model.validatePassword.mockResolvedValue(true);
    model.generateJWT.mockResolvedValue(undefined);

    const req = { body: { user_name: 'test', password: 'pw' } };
    await loginUser(req, res, next);

    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(500);
  });

  test('should verify JWT successfully', async () => {
    model.verifyJWT.mockResolvedValue({ username: 'test' });

    const req = { headers: { authorization: 'Bearer abc.def.ghi' } };
    await verifyUser(req, res, next);

    expect(model.verifyJWT).toHaveBeenCalledWith('abc.def.ghi');
    expect(res.user).toEqual({ username: 'test' });
    expect(next).toHaveBeenCalled();
  });

  test('should handle invalid or missing JWT', async () => {
    model.verifyJWT.mockRejectedValue(new Error('Token error'));

    const req = { headers: { authorization: 'Bearer xyz' } };
    await verifyUser(req, res, next);

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
  });
});
