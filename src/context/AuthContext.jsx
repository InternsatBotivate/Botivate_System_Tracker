import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LocalStorageHelper, STORAGE_KEYS, seedUsers } from '../utils/LocalStorageHelper';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed users if not present
    seedUsers();

    // Check for existing session
    const savedUser = LocalStorageHelper.get(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const users = LocalStorageHelper.get(STORAGE_KEYS.USERS) || [];

    // Login by matching name or role (case insensitive for convenience if we wanted, but strict for now)
    // The dummy users are "Admin User" and "Client User".
    // I added logic to check against name or role. 

    const foundUser = users.find(
      u => (u.name === username || u.role === username || u.id === username) && u.password === password
    );

    if (foundUser) {
      const userData = { ...foundUser };
      setUser(userData);
      LocalStorageHelper.set(STORAGE_KEYS.CURRENT_USER, userData);
      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    LocalStorageHelper.remove(STORAGE_KEYS.CURRENT_USER);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
