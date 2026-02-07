import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const ONE_DAY = 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearSession = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("loginTime");
        setUser(null);
    };

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const loginTime = localStorage.getItem("loginTime");

            if (!token || !loginTime || Date.now() - loginTime > ONE_DAY) {
                clearSession();
                setLoading(false);
                return;
            }

            const res = await axios.get(
                "http://localhost:8000/api/v1/users/current-user",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            setUser(res.data.data);
        } catch (error) {
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
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
