import { AuthContext } from '../AuthContext';

export function withMockAuth(ui, { user = "testuser", token = "mocktoken" } = {}) {
  return (
    <AuthContext.Provider value={{
      user,
      token,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    }}>
      {ui}
    </AuthContext.Provider>
  );
}
