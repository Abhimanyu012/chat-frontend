import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email || !form.password) {
      toast.error("All fields are required!");
      return false;
    }
    if (!validateEmail(form.email)) {
      toast.error("Invalid email address!");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      login(form);
    }
  };

  const { login, isLoggingIn } = useAuthStore();

  // Black theme: dark background, card with dark accents
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="pl-10 pr-4 py-3 w-full border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 transition bg-gray-800 text-white placeholder-gray-400"
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
              className="pl-10 pr-10 py-3 w-full border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 transition bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition flex items-center justify-center border border-gray-700"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <Loader className="size-5 animate-spin" />
                Logging In...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="mt-8 text-center">
          <span className="text-gray-400">Don't have an account? </span>
          <Link to="/signup" className="text-blue-500 hover:underline font-semibold">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
