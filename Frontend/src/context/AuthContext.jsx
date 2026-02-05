import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const ONE_DAY = 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const loginTime = localStorage.getItem("loginTime");

            if (!token || !loginTime || Date.now() - loginTime > ONE_DAY) {
                clearSession();
                return;
            }

            const res = await axios.get(
                "http://localhost:8000/api/v1/users/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            const userData = res.data.data;
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            // only logout if truly unauthorized
            if (error.response?.status === 401) {
                clearSession();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const clearSession = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");
        setUser(null);
        setLoading(false);
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                await axios.post(
                    "http://localhost:8000/api/v1/users/logout",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
            }
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            clearSession();
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
