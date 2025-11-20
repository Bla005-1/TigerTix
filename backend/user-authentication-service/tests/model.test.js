jest.mock('../../shared-db/setup', () => ({
  get: jest.fn(),
  run: jest.fn(),
}));

const db = require('../../shared-db/setup');
const {
  generateHash,
  validatePassword,
  storeUser,
  getUser,
  getHash,
  generateJWT,
  verifyJWT
} = require('../models/authModel');

describe('authModel', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getUser should return NOT_FOUND when missing', async () => {
    db.get.mockResolvedValue(undefined);
    const result = await getUser('someone');
    expect(result).toBe('NOT_FOUND');
  });

  test('getUser should return user object', async () => {
    db.get.mockResolvedValue({ user_name: 'bob' });
    const user = await getUser('bob');
    expect(user).toEqual({ user_name: 'bob' });
  });

  test('generateHash creates a string hash', async () => {
    const hash = await generateHash('pw');
    expect(typeof hash).toBe('string');
  });

  test('validatePassword compares password to hash', async () => {
    // bcrypt's compare executes normally, so just mock with any hash
    const valid = await validatePassword('pw', await generateHash('pw'));
    expect(typeof valid).toBe('boolean');
  });

  test('getHash returns NOT_FOUND when user missing', async () => {
    db.get.mockResolvedValue(undefined);
    const hash = await getHash('nobody');
    expect(hash).toBe('NOT_FOUND');
  });

  test('getHash returns user hash string', async () => {
    db.get.mockResolvedValue({ hash: 'abc123' });
    const result = await getHash('alice');
    expect(result).toBe('abc123');
  });

  test('storeUser stores username + hash', async () => {
    db.run.mockResolvedValue({ id: 1 });
    const result = await storeUser('sam', 'pw_hash');

    expect(db.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      ['sam', 'pw_hash']
    );
    expect(result).toEqual({ id: 1 });
  });

  test('generateJWT returns a token string', async () => {
    process.env.HASH_KEY = 'secret';
    const token = await generateJWT('sam');
    expect(typeof token).toBe('string');
  });

  test('verifyJWT returns decoded token', async () => {
    process.env.HASH_KEY = 'secret';
    const token = await generateJWT('sam');
    const decoded = await verifyJWT(token);
    expect(decoded.username).toBe('sam');
  });
});
