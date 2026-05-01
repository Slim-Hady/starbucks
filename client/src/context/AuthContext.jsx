import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const MOCK_USER = { email: 'user@starbucks.com', name: 'Alex Johnson', stars: 175 };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = useCallback((email, password) => {
    if (email === 'user@starbucks.com' && password === 'password123') {
      setUser(MOCK_USER);
      setError('');
      return true;
    }
    setError('Invalid email or password. Try user@starbucks.com / password123');
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
