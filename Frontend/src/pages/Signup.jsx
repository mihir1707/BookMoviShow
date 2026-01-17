import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Signup() {

    const [isOpen, setIsOpen] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const openModal = () => setIsOpen(true);
        window.addEventListener("open-signup-modal", openModal);
        return () => window.removeEventListener("open-signup-modal", openModal);
    }, []);

    if (!isOpen) return null;

    const handleSignup = async () => {
        setError("");

        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(userCredential.user, {
                displayName: name,
            });

            alert("Account created successfully 🎉");
            setIsOpen(false);
        } catch (err) {
            console.error(err.code);

            if (err.code === "auth/email-already-in-use") {
                setError("Email already exists");
            } else {
                setError("Signup failed. Try again.");
            }
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            alert("Google signup successful 🎉");
            setIsOpen(false);
        } catch {
            setError("Google signup failed");
        }
    };

    const handleFacebookSignup = async () => {
        try {
            const provider = new FacebookAuthProvider();
            await signInWithPopup(auth, provider);
            alert("Facebook signup successful 🎉");
            setIsOpen(false);
        } catch {
            setError("Facebook signup failed");
        }
    };

    const handleTwitterSignup = async () => {
        try {
            const provider = new TwitterAuthProvider();
            await signInWithPopup(auth, provider);
            alert("Twitter signup successful 🎉");
            setIsOpen(false);
        } catch {
            setError("Twitter signup failed");
        }
    };

    const handleMicrosoftSignup = async () => {
        try {
            const provider = new OAuthProvider("microsoft.com");
            await signInWithPopup(auth, provider);
            alert("Microsoft signup successful 🎉");
            setIsOpen(false);
        } catch {
            setError("Microsoft signup failed");
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-white">

            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative w-95 rounded-2xl border-2 border-black bg-black/90 shadow-2xl p-6">

                {/* Logo */}
                <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        🎬
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-center">
                    Create account
                </h2>
                <p className="text-sm text-center mb-5">
                    Sign up to get started.
                </p>

                {/* Social Buttons */}
                <div className="flex gap-3 mb-5">
                    <button 
                        className="cursor-pointer flex-1 flex items-center justify-center border rounded-lg py-2"
                        onClick={handleGoogleSignup}
                    >
                        <FcGoogle size={20} />
                    </button>
                    <button 
                        className="cursor-pointer flex-1 flex items-center justify-center border rounded-lg py-2"
                        onClick={handleMicrosoftSignup}
                    >
                        <FaMicrosoft size={18} color="#00A4EF" />
                    </button>
                    <button 
                        className="cursor-pointer flex-1 flex items-center justify-center border rounded-lg py-2"
                        onClick={handleFacebookSignup}
                    >
                        <FaFacebookF size={18} color="#1877F2" />
                    </button>
                    <button 
                        className="cursor-pointer flex-1 flex items-center justify-center border rounded-lg py-2"
                        onClick={handleTwitterSignup}
                    >
                        <FaTwitter size={18} color="#1DA1F2" />
                    </button>
                </div>

                <div className="text-center text-xs mb-3">OR</div>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-2">
                        {error}
                    </p>
                )}

                {/* Name */}
                <div className="mb-3">
                    <label className="text-sm">Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name..."
                        className="w-full mt-1 px-3 py-2 rounded-lg border outline-none focus:ring-2"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

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
                <div className="mb-4">
                    <label className="text-sm">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password..."
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

                {/* Submit */}
                <button
                    onClick={handleSignup}
                    className="w-full py-2 rounded-lg bg-black text-white font-medium shadow-sm shadow-white"
                >
                    Sign up
                </button>

                {/* Switch back to login */}
                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <span
                        className="font-medium cursor-pointer hover:underline"
                            onClick={() => {
                                setIsOpen(false);
                                window.dispatchEvent(new Event("open-login-modal"));
                            }}
                        >
                            Login
                    </span>

                </p>
            </div>
        </div>
    );
}
