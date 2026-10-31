"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { BookOpen, User, Mail, Image as ImageIcon, Lock, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = "BookNook | Register";
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // পাসওয়ার্ড ভ্যালিডেশন চেক
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isMinLength = password.length >= 6;

  const validatePassword = () => {
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowercase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!isMinLength) {
      return "Password must be at least 6 characters long.";
    }
    return "";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validatePassword();
    if (err) {
      setPasswordError(err);
      toast.error(err);
      return;
    }
    setPasswordError("");

    setLoading(true);
    try {
      // ছবি না দিলে স্বয়ংক্রিয়ভাবে নামের অক্ষর দিয়ে অবতার জেনারেট হবে
      const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "User")}`;
      const userImage = photoURL.trim() ? photoURL.trim() : defaultAvatar;

      const res = await signUp.email({
        email,
        password,
        name,
        image: userImage,
      });

      if (res?.error) {
        toast.error(res.error.message || "Registration failed. Try again.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.error("Google login will be active once credentials are provided in .env");
  };

  return (
    <div className="flex min-h-[calc(100vh-130px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-indigo-50 text-indigo-600 mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Create an Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join BookNook to borrow and share books</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Photo URL Field (OPTIONAL) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Photo URL</label>
              <span className="text-xs text-slate-400">(Optional)</span>
            </div>
            <div className="relative">
              <ImageIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="Leave blank for default avatar"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Validation Checklist UI */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1 text-xs">
                <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600" : "text-slate-400"}`}>
                  {hasUppercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>Must have an uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-600" : "text-slate-400"}`}>
                  {hasLowercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>Must have a lowercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isMinLength ? "text-emerald-600" : "text-slate-400"}`}>
                  {isMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>Must be at least 6 characters long</span>
                </div>
              </div>
            )}

            {passwordError && (
              <p className="mt-1 text-xs text-red-500">{passwordError}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Register</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Social Login Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Link to Login */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}