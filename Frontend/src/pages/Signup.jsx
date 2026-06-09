import { useState } from "react";
import { Eye, EyeOff, User, ShieldCheck } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider, RecaptchaVerifier, signInWithPhoneNumber } from "../lib/firebase.js";
import { signInWithPopup } from "firebase/auth";

export default function Signup() {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");  // "user" or "admin"
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Phone auth state
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    const handleFirebaseAuth = async (idToken) => {
        try {
            setLoading(true);
            const res = await axios.post(
                `${baseUrl}/users/firebase-auth`,
                { idToken },
                { withCredentials: true }
            );

            const { accessToken, refreshToken, user } = res.data.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("loginTime", Date.now());

            setUser(user);
            alert("Signup successful");
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            await handleFirebaseAuth(idToken);
        } catch (error) {
            console.error(error);
            setError("Google signup failed");
        }
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible'
            });
        }
    };

    const handleSendOtp = async () => {
        try {
            setError("");
            setupRecaptcha();
            const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
            setConfirmationResult(confirmation);
            alert("OTP sent to " + formattedPhone);
        } catch (error) {
            console.error(error);
            setError("Failed to send OTP. Try adding country code like +91");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setError("");
            const result = await confirmationResult.confirm(otp);
            const idToken = await result.user.getIdToken();
            await handleFirebaseAuth(idToken);
        } catch (error) {
            console.error(error);
            setError("Invalid OTP");
        }
    };

    const handleSignup = async () => {
        setError("");

        if (!name || !username || !email || !phoneNumber || !password) {
            setError("All fields are required");
            return;
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            setError("Phone number must be exactly 10 digits");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `${baseUrl}/users/register`,
                { name, email, username, password, phoneNumber, role },
                { withCredentials: true }
            );

            alert("Account created successfully! Please login.");
            navigate("/login");
        }
        catch (err) {
            console.error("Signup Error:", err);
            const message = err.response?.data?.message || "Signup failed. Please try again.";
            setError(message);
        }
        finally {
            setLoading(false);
        }
    };

    // Firebase handlers mapped above

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white px-3 sm:px-4 py-8">

            <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-black/90 shadow-2xl p-5 sm:p-7">

                <div className="flex justify-center mb-2">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl">
                        🎬
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-center">Create account</h2>
                <p className="text-xs text-center text-gray-400 mb-5 mt-1">Sign up to get started.</p>

                {error && (
                    <p className="text-red-500 text-xs text-center mb-3 bg-red-500/10 border border-red-500/30 rounded-lg py-2 px-3">
                        {error}
                    </p>
                )}

                {/* Role Selector */}
                <div className="mb-4">
                    <label className="text-xs sm:text-sm block mb-2">Account Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setRole("user")}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                                role === "user"
                                    ? "bg-primary text-black border-primary"
                                    : "border-gray-700 text-gray-300 hover:border-gray-500"
                            }`}
                        >
                            <User size={15} />
                            User
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("admin")}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                                role === "admin"
                                    ? "bg-amber-400 text-black border-amber-400"
                                    : "border-gray-700 text-gray-300 hover:border-gray-500"
                            }`}
                        >
                            <ShieldCheck size={15} />
                            Admin
                        </button>
                    </div>
                    {role === "admin" && (
                        <p className="text-xs text-amber-400 mt-1.5 flex items-center gap-1">
                            ⚠️ Admin accounts have full access to the dashboard.
                        </p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="text-xs sm:text-sm">Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name..."
                        value={name}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white bg-black outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="text-xs sm:text-sm">Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username..."
                        value={username}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white bg-black outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="text-xs sm:text-sm">E-Mail Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        value={email}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white bg-black outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="text-xs sm:text-sm">Phone No.</label>
                    <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phoneNumber}
                        maxLength={10}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-white bg-black outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    />
                </div>

                <div className="mb-5">
                    <label className="text-xs sm:text-sm">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimum 6 characters"
                            value={password}
                            className="w-full mt-1 px-3 py-2 rounded-lg border border-white bg-black pr-10 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/4 text-gray-400"
                        >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full py-2.5 mb-3 rounded-lg bg-primary cursor-pointer text-black font-semibold hover:bg-primary-dull transition disabled:opacity-50 text-sm"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-gray-700"></div>
                    <span className="px-3 text-xs text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-700"></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full mb-3 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition cursor-pointer text-sm"
                >
                    <FcGoogle size={18} /> Sign up with Google
                </button>

                <div className="w-full border border-gray-700 rounded-lg p-3 bg-black/50">
                    <p className="text-xs text-gray-400 mb-2 text-center">Sign up with Phone</p>
                    {!confirmationResult ? (
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Phone (e.g. +91...)" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded bg-black border border-white outline-none text-sm focus:border-primary"
                            />
                            <button onClick={handleSendOtp} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs cursor-pointer border border-gray-600">
                                Send OTP
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Enter OTP" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded bg-black border border-white outline-none text-sm focus:border-primary"
                            />
                            <button onClick={handleVerifyOtp} className="px-3 py-1.5 bg-primary text-black font-medium rounded text-xs cursor-pointer">
                                Verify
                            </button>
                        </div>
                    )}
                </div>

                <div id="recaptcha-container"></div>

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
