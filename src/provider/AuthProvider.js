import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken, removeToken] = useLocalStorage('token', null);

  return (
    <AuthContext.Provider value={{ token, setToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
