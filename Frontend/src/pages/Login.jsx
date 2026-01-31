import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaFacebookF, FaTwitter } from "react-icons/fa";
import axios from "axios";

export default function Login() {

    const [isOpen, setIsOpen] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const openModal = () => setIsOpen(true);
        window.addEventListener("open-login-modal", openModal);
        return () => window.removeEventListener("open-login-modal", openModal);
    }, []);

    if (!isOpen) return null;

    const handleLogin = async () => {
        console.log("Hello!")
        setError("");
        if(!email || !password){
            setError("Email and password are required");
            return;
        }
        try {
            const res = await axios.post("http://localhost:8000/api/v1/users/login",
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            const { accessToken, refreshToken, user } = res.data.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login successful");
            setIsOpen(false);

        } 
        catch(err){
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
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-white">

            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsOpen(false)}
            />

            <div 
                className="relative w-95 rounded-2xl border-2 border-black bg-black/90 shadow-2xl p-6 "
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex justify-center mb-3 ">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        🎬
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-center text-white">
                    Welcome back
                </h2>
                <p className="text-sm text-4 pb-5 ml-15">
                    Please enter your detail to sign in.
                </p>

                {/* Social Buttons */}
                <div className="flex gap-3 mb-5">
                    <button 
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 border rounded-lg py-2"
                    >
                        <FcGoogle size={20} />
                    </button>

                    <button  className="cursor-pointer flex-1 flex items-center justify-center gap-2 border rounded-lg py-2">
                        <FaMicrosoft size={18} color="#00A4EF" />
                    </button>

                    <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 border rounded-lg py-2">
                        <FaFacebookF size={18} color="#1877F2" />
                    </button>

                    <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 border rounded-lg py-2">
                        <FaTwitter size={18} color="#1DA1F2" />
                    </button>
                </div>

                <div className="text-center text-xs mb-3">OR</div>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-2">
                        {error}
                    </p>
                )}

                {/* Email */}
                <div className="mb-3">
                    <label className="text-sm">E-Mail Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        className="w-full mt-1 px-3 py-2 rounded-lg border outline-none focus:ring-2"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                </div>

                {/* Password */}
                <div className="mb-3">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter you password..."
                            className="w-full mt-1 px-3 py-2 rounded-lg border pr-10 outline-none focus:ring-2"
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
                    <span className="cursor-pointer text-gray-600 hover:underline">
                        Forgot password?
                    </span>
                </div>

                {/* Submit */}
                <button
                    onClick={handleLogin}
                    className="w-full py-2 shadow-sm shadow-white cursor-pointer rounded-lg bg-black text-white font-medium hover:bg-black/90"
                >
                    Login
                </button>

                <p className="text-center text-sm mt-4">
                    Don't have an account?{" "}
                    <span
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => {
                            setIsOpen(false);
                            window.dispatchEvent(new Event("open-signup-modal"));
                        }}
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}
