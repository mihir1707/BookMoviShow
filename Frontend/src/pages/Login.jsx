import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaFacebookF, FaTwitter } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");

        console.log(email)
        console.log(password)
        if(!email || !password){
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                "http://localhost:8000/api/v1/users/login",
                { email, password },
                { withCredentials: true }
            );

            const { accessToken, refreshToken, user } = res.data.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login successful");
            navigate("/"); // redirect after login
        } 
        catch (err) {
            console.error(err);

            if(err.response?.status === 401){
                setError("Invalid credentials");
            } 
            else if(err.response?.status === 404){
                setError("User not found");
            } 
            else{
                setError("Login failed. Try again.");
            }
        }
        finally {
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
                    Welcome back
                </h2>
                <p className="text-sm text-center text-gray-400 mb-5">
                    Please enter your details to sign in.
                </p>

                <div className="flex gap-3 mb-5">
                    <button className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2">
                        <FcGoogle size={20} />
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2">
                        <FaMicrosoft size={18} color="#00A4EF" />
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2">
                        <FaFacebookF size={18} color="#1877F2" />
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2">
                        <FaTwitter size={18} color="#1DA1F2" />
                    </button>
                </div>

                <div className="text-center text-xs mb-3 text-gray-400">OR</div>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-3">
                        {error}
                    </p>
                )}

                <div className="mb-3">
                    <label className="text-sm">E-Mail Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        className="w-full mt-1 px-3 py-2 rounded-lg border bg-black outline-none focus:ring-2"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="text-sm">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password..."
                            className="w-full mt-1 px-3 py-2 rounded-lg border bg-black pr-10 outline-none focus:ring-2"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-4"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm mb-4">
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
                    className="w-full py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary-dull transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm mt-4 text-gray-400">
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