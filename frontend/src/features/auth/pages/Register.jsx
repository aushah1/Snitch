import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import GoogleLogin from "../components/GoogleLogin";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    isSeller: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const { handleRegister } = useAuth();
  const Navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10,}$/.test(formData.contact.replace(/\D/g, ""))) {
      newErrors.contact = "Please enter a valid phone number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Must contain uppercase, lowercase, and numbers";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      let user = await handleRegister(formData);
      if (user.role === "seller") {
        Navigate("/dashboard");
      } else {
        Navigate("/");
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const passwordStrength = () => {
    if (!formData.password) return { level: 0, text: "" };
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/\d/.test(formData.password)) strength++;
    if (/[^\w\s]/.test(formData.password)) strength++;
    const levels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = [
      "bg-error",
      "bg-secondary",
      "bg-secondary-container",
      "bg-on-surface-variant",
      "bg-primary",
    ];
    return { level: strength, text: levels[strength - 1], color: colors[strength - 1] };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary-container relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 right-16 w-72 h-72 border border-outline-variant/30 rounded-full" />
          <div className="absolute bottom-20 left-20 w-56 h-56 border border-outline-variant/20 rounded-full" />
        </div>
        <div className="relative z-10 text-center px-16 max-w-lg">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-outline mb-6">
            Begin Your Journey
          </p>
          <h1 className="font-headline text-5xl text-inverse-on-surface font-light leading-[1.1] mb-6">
            Join the <em className="italic">Atelier</em>
          </h1>
          <div className="w-12 h-px bg-secondary mx-auto mb-10 opacity-60" />
          <p className="text-sm text-outline leading-relaxed font-light">
            Whether you're a discerning collector or a passionate artisan,
            your place in our community awaits.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto page-enter">
        <div className="w-full max-w-lg">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="no-underline">
              <span className="font-headline text-3xl text-on-surface">
                MAISON<em className="not-italic font-light opacity-50">elle</em>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <p className="label-atelier text-secondary mb-3">// Register</p>
            <h2 className="font-headline text-4xl text-on-surface font-light">
              Create <em className="italic">Account</em>
            </h2>
            <p className="mt-3 text-sm text-outline font-light">
              Join us today to get started
            </p>
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="mb-6 py-3 px-5 bg-error-container/30 rounded-2xl">
              <p className="text-sm text-error">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullname" className="label-atelier">Full Name</label>
              <input
                id="reg-fullname"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                className={`input-atelier ${errors.fullname ? "input-error" : ""}`}
              />
              {errors.fullname && <p className="text-error text-xs mt-2 ml-4">{errors.fullname}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label-atelier">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`input-atelier ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="text-error text-xs mt-2 ml-4">{errors.email}</p>}
            </div>

            {/* Contact */}
            <div>
              <label htmlFor="reg-contact" className="label-atelier">Contact Number</label>
              <input
                id="reg-contact"
                name="contact"
                type="tel"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`input-atelier ${errors.contact ? "input-error" : ""}`}
              />
              {errors.contact && <p className="text-error text-xs mt-2 ml-4">{errors.contact}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="label-atelier">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer text-xs"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {/* Strength */}
              {formData.password && (
                <div className="mt-3 ml-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[0.6rem] uppercase tracking-wider text-outline">Strength</span>
                    <span className="text-[0.6rem] uppercase tracking-wider text-on-surface-variant font-medium">{strength.text}</span>
                  </div>
                  <div className="w-full bg-surface-high rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${strength.color}`}
                      style={{ width: `${(strength.level / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-error text-xs mt-2 ml-4">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm-password" className="label-atelier">Confirm Password</label>
              <div className="relative">
                <input
                  id="reg-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-atelier pr-12 ${errors.confirmPassword ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer text-xs"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`text-xs mt-2 ml-4 ${formData.password === formData.confirmPassword ? "text-secondary" : "text-error"}`}>
                  {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
              {errors.confirmPassword && <p className="text-error text-xs mt-2 ml-4">{errors.confirmPassword}</p>}
            </div>

            {/* Seller Toggle */}
            <div className="bg-secondary-container/20 rounded-2xl p-5 flex items-center gap-4">
              <input
                type="checkbox"
                id="isSeller"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleChange}
                className="checkbox-atelier"
              />
              <div>
                <label htmlFor="isSeller" className="text-sm font-medium text-on-surface cursor-pointer block">
                  I am an artisan
                </label>
                <p className="text-[0.65rem] text-outline mt-0.5">
                  Register as a seller to list your creations
                </p>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 ml-1">
              <input type="checkbox" id="terms" className="checkbox-atelier mt-0.5" />
              <label htmlFor="terms" className="text-xs text-outline font-light leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-secondary no-underline font-medium hover:opacity-80">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-secondary no-underline font-medium hover:opacity-80">Privacy Policy</a>
              </label>
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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-[0.6rem] uppercase tracking-[0.15em] text-outline">or</span>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>

          {/* Social */}
          <GoogleLogin />

          {/* Sign In link */}
          <p className="text-center text-sm text-outline mt-8 font-light">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary font-medium no-underline hover:opacity-80 transition-opacity">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
