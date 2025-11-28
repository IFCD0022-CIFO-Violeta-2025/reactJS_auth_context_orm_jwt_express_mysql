import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// Helpers para cookies
const setCookie = (name, value, days = 1) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString(); // 864e5 = 24*60*60*1000 (1 día)
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
};

const getCookie = (name) => {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.split('=')[1]) : null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getCookie('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setCookie('token', token);
    } else {
      deleteCookie('token');
    }
    setLoading(false);
  }, [token]);

  const login = (accessToken, userEmail) => {
    setToken(accessToken);
    setUser({ email: userEmail });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <UserContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </UserContext.Provider>
  );
};
