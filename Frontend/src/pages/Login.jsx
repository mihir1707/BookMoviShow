import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
// import { auth, googleProvider } from "../firebase.js";
// import { signInWithPopup } from "firebase/auth";

export default function Login() {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    const handleLogin = async () => {
        setError("");

        console.log(email)
        console.log(password)
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${baseUrl}/users/login`,
                { email, password },
                { withCredentials: true }
            );

            const { accessToken, refreshToken, user } = res.data.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("loginTime", Date.now());

            setUser(user);

            alert("Login successful");
            navigate("/"); // redirect after login
        }
        catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                setError("Invalid email or password");
            }
            else if (err.response?.status === 404) {
                setError("User not found");
            }
            else {
                setError("Login failed. Try again.");
            }
        }
        finally {
            setLoading(false);
        }
    };

    // const handleGoogleLogin = async () => {
    //     try {
    //         const result = await signInWithPopup(auth, googleProvider);
    //         const user = result.user;

    //         console.log(user);

    //         localStorage.setItem("user", JSON.stringify(user));
    //         setUser(user);

    //         alert("Google login successful");
    //         navigate("/");
    //     }
    //     catch (error) {
    //         console.error(error);
    //         setError("Google login failed");
    //     }
    // };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white px-3 sm:px-4">

            <div className="w-full sm:w-95 rounded-2xl border border-gray-700 bg-black/90 shadow-2xl p-4 sm:p-6">

                <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                        🎬
                    </div>
                </div>

                <h2 className="text-lg sm:text-xl font-semibold text-center">
                    Welcome back
                </h2>
                <p className="text-xs sm:text-sm text-center text-gray-400 mb-6 sm:mb-8">
                    Please enter your details to sign in.
                </p>

                {error && (
                    <p className="text-red-500 text-xs sm:text-sm text-center mb-3">
                        {error}
                    </p>
                )}

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
                    <label className="text-xs sm:text-sm">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password..."
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

                <div className="flex justify-between items-center text-xs sm:text-sm mb-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={() => setRemember(!remember)}
                        />
                        Remember me
                    </label>
                    <span className="cursor-pointer text-gray-400 hover:underline">
                        Forgot password?
                    </span>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary-dull transition cursor-pointer text-sm"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-xs sm:text-sm mt-4 text-gray-400">
                    Don't have an account?{" "}
                    <span
                        className="font-medium cursor-pointer hover:underline text-white"
                        onClick={() => navigate("/signup")}
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}