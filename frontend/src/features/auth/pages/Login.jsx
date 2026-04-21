import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import GoogleLogin from "../components/GoogleLogin";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const { handleLogin } = useAuth();
  const Navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let user = await handleLogin(formData);
      if (user?.role === "seller") {
        Navigate("/dashboard");
      } else {
        Navigate("/");
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left - Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-container relative overflow-hidden items-center justify-center">
        {/* Decorative bg pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 border border-outline-variant/30 rounded-full" />
          <div className="absolute bottom-32 right-16 w-96 h-96 border border-outline-variant/20 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-outline-variant/20 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-16 max-w-lg">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-outline mb-6">
            Welcome to
          </p>
          <h1 className="font-headline text-6xl text-inverse-on-surface font-light leading-[1.1] mb-6">
            MAISON<em className="not-italic opacity-50">elle</em>
          </h1>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-outline-variant mb-12">
            The Curated Atelier
          </p>
          <div className="w-12 h-px bg-secondary mx-auto mb-12 opacity-60" />
          <p className="text-sm text-outline leading-relaxed font-light">
            Where craftsmanship meets curation. Access your atelier to discover
            premium, handcrafted luxury.
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 page-enter">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-12">
            <Link to="/" className="no-underline">
              <span className="font-headline text-3xl text-on-surface">
                MAISON<em className="not-italic font-light opacity-50">elle</em>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10">
            <p className="label-atelier text-secondary mb-3">// Access</p>
            <h2 className="font-headline text-4xl text-on-surface font-light">
              Welcome <em className="italic">Back</em>
            </h2>
            <p className="mt-3 text-sm text-outline font-light">
              Sign in to your atelier account
            </p>
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="mb-6 py-3 px-5 bg-error-container/30 rounded-2xl">
              <p className="text-sm text-error">{errors.submit}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="you@example.com"
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
                  className={`input-atelier pr-12 ${errors.password ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-2 ml-4">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox-atelier" />
                <span className="text-xs text-on-surface-variant font-light">
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-xs text-secondary no-underline hover:opacity-80 transition-opacity font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-pill btn-primary w-full text-sm py-3.5"
            >
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

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-[0.6rem] uppercase tracking-[0.15em] text-outline">
              or continue with
            </span>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>

          {/* Social */}
          <div className="space-y-3">
            <GoogleLogin />
          </div>

          {/* Sign Up */}
          <p className="text-center text-sm text-outline mt-10 font-light">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-secondary font-medium no-underline hover:opacity-80 transition-opacity"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
