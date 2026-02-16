import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaFacebookF, FaTwitter } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {

    const navigate = useNavigate();

    const { setUser } = useAuth();

    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    const handleSignup = async () => {
        setError("");

        if (!name || !username || !email || !phoneNumber || !password) {
            setError("All fields are required");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${baseUrl}/users/register`,
                {
                    name,
                    email,
                    username,
                    password,
                    phoneNumber,
                },
                {
                    withCredentials: true,
                }
            );

            const { accessToken, refreshToken, user } = res.data.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("loginTime", Date.now());

            setUser(user);

            alert("Account created successfully");
            navigate("/");
        }
        catch (err) {
            console.error(err);

            if (err.response?.status === 409) {
                setError("Email already exists");
            } else {
                setError("Signup failed. Try again.");
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white px-3 sm:px-4">

            <div className="w-full sm:w-95 rounded-2xl border border-gray-700 bg-black/90 shadow-2xl p-4 sm:p-6">

                <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                        🎬
                    </div>
                </div>

                <h2 className="text-lg sm:text-xl font-semibold text-center">
                    Create account
                </h2>
                <p className="text-xs sm:text-sm text-center text-gray-400 mb-4 sm:mb-5">
                    Sign up to get started.
                </p>

                <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <button className="flex-1 cursor-pointer flex items-center justify-center border rounded-lg py-2 hover:bg-gray-900/50 transition">
                        <FcGoogle size={18} className='sm:w-5 sm:h-5' />
                    </button>
                    <button className="flex-1 flex cursor-pointer items-center justify-center border rounded-lg py-2 hover:bg-gray-900/50 transition">
                        <FaMicrosoft size={16} className='sm:w-4.5 sm:h-4.5' color="#00A4EF" />
                    </button>
                    <button className="flex-1 flex cursor-pointer items-center justify-center border rounded-lg py-2 hover:bg-gray-900/50 transition">
                        <FaFacebookF size={16} className='sm:w-4.5 sm:h-4.5' color="#1877F2" />
                    </button>
                    <button className="flex-1 flex cursor-pointer items-center justify-center border rounded-lg py-2 hover:bg-gray-900/50 transition">
                        <FaTwitter size={16} className='sm:w-4.5 sm:h-4.5' color="#1DA1F2" />
                    </button>
                </div>

                <div className="text-center text-xs mb-2 sm:mb-3 text-gray-400">OR</div>

                {error && (
                    <p className="text-red-500 text-xs sm:text-sm text-center mb-3">
                        {error}
                    </p>
                )}

                <div className="mb-3">
                    <label className="text-xs sm:text-sm">Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name..."
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-black outline-none focus:ring-2 text-sm"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="text-xs sm:text-sm">User Name</label>
                    <input
                        type="text"
                        placeholder="Enter your username..."
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-black outline-none focus:ring-2 text-sm"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="text-xs sm:text-sm">E-Mail Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-black outline-none focus:ring-2 text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="text-xs sm:text-sm">Phone No.</label>
                    <input
                        type="text"
                        placeholder="Enter your phone number..."
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-black outline-none focus:ring-2 text-sm"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="text-xs sm:text-sm">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password..."
                            className="w-full mt-1 px-3 py-2 rounded-lg border bg-black pr-10 outline-none focus:ring-2 text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 sm:top-4"
                        >
                            {showPassword ? <EyeOff size={14} className='sm:w-4 sm:h-4' /> : <Eye size={14} className='sm:w-4 sm:h-4' />}
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-primary cursor-pointer text-black font-medium hover:bg-primary-dull transition disabled:opacity-50 text-sm"
                >
                    {loading ? "Creating account..." : "Sign up"}
                </button>

                <p className="text-center text-xs sm:text-sm mt-4 text-gray-400">
                    Already have an account?{" "}
                    <span
                        className="font-medium cursor-pointer hover:underline text-white"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
