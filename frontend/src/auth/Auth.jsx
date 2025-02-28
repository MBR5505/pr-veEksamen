import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext({ user: null, setUser: () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/auth/user`, { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
        // Don't log the context itself - it's just a React object
        console.log("User data:", response.data.user);
      })
      .catch((error) => {
        console.error("Auth error:", error);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const fetchUser = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/api/auth/user`, { withCredentials: true });
    return response.data.user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
};

export default AuthProvider;