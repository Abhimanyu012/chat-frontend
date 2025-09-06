import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const SignupPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isSigningUp } = useAuthStore();

  const validate = () => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      toast.error("All fields are required");
      return false;
    }
    if (!validateEmail(form.email)) {
      toast.error("Invalid email address");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form values:', form);
    if (validate()) {
      signUp(form);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-10 border border-gray-800">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-white tracking-tight">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <User size={20} />
            </span>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="pl-10 pr-4 py-3 w-full bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="name"
            />
          </div>
          {/* Email */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Mail size={20} />
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="pl-10 pr-4 py-3 w-full bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="email"
            />
          </div>
          {/* Password */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Lock size={20} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="pl-10 pr-10 py-3 w-full bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500 transition"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 flex items-center justify-center bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <div className="mt-8 text-center">
          <span className="text-gray-400">Already have an account?{" "}</span>
          <Link to="/login" className="text-blue-500 hover:underline transition-all">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
