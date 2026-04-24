import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('finance_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Refresh profile from server to get latest role
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${parsedUser.token}`
            }
          });
          const data = await response.json();
          if (data.success) {
        const updatedUser = { 
          ...parsedUser, 
          role: data.role, 
          name: data.name,
          profilePic: data.profilePic 
        };
        setUser(updatedUser);
        localStorage.setItem('finance_user', JSON.stringify(updatedUser));
      } else {
            // Token might be expired
            logout();
          }
        } catch (error) {
          console.error('Failed to refresh profile:', error);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = { 
          id: data._id, 
          email: data.email, 
          role: data.role, 
          name: data.name,
          profilePic: data.profilePic,
          token: data.token 
        };
        setUser(userData);
        localStorage.setItem('finance_user', JSON.stringify(userData));
        return { success: true, role: userData.role };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Server connection error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finance_user');
  };

  const updateUserProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('finance_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile, loading, theme, toggleTheme }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
