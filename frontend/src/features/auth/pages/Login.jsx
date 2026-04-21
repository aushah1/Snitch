import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import GoogleLogin from "../components/GoogleLogin";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const { handleLogin } = useAuth();
  const Navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    try {
      let user = await handleLogin(formData);
      if (user?.role === "seller") Navigate("/dashboard");
      else Navigate("/");
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Watermark "ACCESS" text behind the card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="font-headline text-[12rem] sm:text-[16rem] lg:text-[20rem] tracking-tight text-outline-variant/8 font-light uppercase">
          ACCESS
        </h1>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-surface-lowest rounded-[2rem] p-10 sm:p-12 shadow-ambient-lg page-enter">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="no-underline">
            <h2 className="font-headline text-3xl text-on-surface">
              <em className="italic">MAISON</em>
              <span className="font-light not-italic">elle</span>
            </h2>
          </Link>
          <p className="label-atelier text-outline mt-2 !mb-0">
            The Curated Atelier
          </p>
        </div>

        {/* Error */}
        {errors.submit && (
          <div className="mb-6 py-3 px-5 bg-error-container/30 rounded-2xl">
            <p className="text-sm text-error">{errors.submit}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="label-atelier">
              Email Address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="atelier@maisonelle.com"
              className={`input-atelier ${errors.email ? "input-error" : ""}`}
            />
            {errors.email && (
              <p className="text-error text-xs mt-2 ml-4">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="label-atelier">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input-atelier pr-16 ${errors.password ? "input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer text-xs uppercase tracking-wider font-medium">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-xs mt-2 ml-4">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-pill btn-primary w-full text-sm py-3.5 mt-2">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner-atelier !w-4 !h-4 !border-white/30 !border-t-white" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 text-center">
          <a
            href="/forgot-password"
            className="block text-xs text-outline no-underline uppercase tracking-[0.12em] hover:text-secondary transition-colors">
            Forgot Password
          </a>
          <Link
            to="/register"
            className="block text-xs text-outline no-underline uppercase tracking-[0.12em] hover:text-secondary transition-colors">
            Create Account
          </Link>
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="text-[0.6rem] uppercase tracking-[0.15em] text-outline">
            or
          </span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        {/* Social */}
        {/* <GoogleLogin /> */}
      </div>
    </div>
  );
};

export default Login;
