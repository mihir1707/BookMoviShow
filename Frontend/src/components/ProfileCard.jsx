import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProfileCard({ user }) {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const getUserInitial = () => {
            if (!user) return "";
            if(user.name){
                const words = user.name.trim().split(/\s+/);
                const firstInitial = words[0]?.charAt(0).toUpperCase() || "";
                const secondInitial = words[1]?.charAt(0).toUpperCase() || "";
                return firstInitial + secondInitial;
            }
            return user.email?.charAt(0).toUpperCase() || "";
        };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="relative" ref={menuRef}>
            <div
                onClick={() => setOpen(!open)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-lg cursor-pointer hover:bg-primary-dull"
                title={user.name || user.email}
            >
                {getUserInitial()}
            </div>

            {open && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-60 bg-black shadow-lg rounded-lg border-2 z-50">
                    <ul className="py-2 text-sm text-gray-700">
                        <li
                            onClick={() => navigate("/my-bookings")}
                            className="px-4 py-2 hover:bg-primary-dull text-white cursor-pointer"
                        >
                            My Bookings
                        </li>
                        <li
                            onClick={() => navigate("/profile")}
                            className="px-4 py-2 hover:bg-primary-dull text-white cursor-pointer"
                        >
                            Update Details
                        </li>
                        <li
                            onClick={handleLogout}
                            className="px-4 py-2 hover:bg-primary-dull text-red-600 hover:text-white cursor-pointer"
                        >
                            Logout
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default ProfileCard
