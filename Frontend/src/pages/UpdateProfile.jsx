import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UpdateProfile() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setUsername(user.username || "");
            setEmail(user.email || "");
            setPhoneNumber(user.phoneNumber || "");
        }
    }, [user]);

    const handleUpdate = async () => {
        setError("");

        if (!name || !username || !email || !phoneNumber) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.patch(
                `${baseUrl}/users/update-account`,
                {
                    name,
                    username,
                    email,
                    phoneNumber,
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            const updatedUser = res.data.data;

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            alert("Profile updated successfully");
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Profile update failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
            <div className="w-95 rounded-2xl border border-gray-700 bg-black/90 shadow-2xl p-6">

                <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                        🎬
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-center">
                    Update Profile
                </h2>
                <p className="text-sm text-center text-gray-400 mb-5">
                    Manage your account details
                </p>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-3">
                        {error}
                    </p>
                )}

                <div className="mb-3">
                    <label className="text-sm">Full Name</label>
                    <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-black outline-none focus:ring-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="text-sm">User Name</label>
                    <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-black outline-none focus:ring-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="text-sm">E-Mail Address</label>
                    <input
                        type="email"
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-black outline-none focus:ring-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="text-sm">Phone No.</label>
                    <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-black outline-none focus:ring-2"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-primary cursor-pointer text-black font-medium hover:bg-primary-dull transition disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>

                <p className="text-center text-sm mt-4 text-gray-400">
                    <span
                        className="cursor-pointer hover:underline text-white"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Home
                    </span>
                </p>
            </div>
        </div>
    );
}
