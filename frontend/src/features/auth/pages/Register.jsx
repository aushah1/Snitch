import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import GoogleLogin from "../components/GoogleLogin";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "", email: "", contact: "", password: "", confirmPassword: "", isSeller: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const { handleRegister } = useAuth();
  const Navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    else if (formData.fullname.trim().length < 2) newErrors.fullname = "Full name must be at least 2 characters";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required";
    else if (!/^\d{10,}$/.test(formData.contact.replace(/\D/g, ""))) newErrors.contact = "Please enter a valid phone number";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = "Must contain uppercase, lowercase, and numbers";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    try {
      let user = await handleRegister(formData);
      if (user.role === "seller") Navigate("/dashboard");
      else Navigate("/");
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
    const colors = ["bg-error", "bg-secondary", "bg-secondary-container", "bg-on-surface-variant", "bg-primary"];
    return { level: strength, text: levels[strength - 1], color: colors[strength - 1] };
  };
  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="font-headline text-[10rem] sm:text-[14rem] lg:text-[18rem] tracking-tight text-outline-variant/8 font-light uppercase">
          Join
        </h1>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg bg-surface-lowest rounded-[2rem] p-10 sm:p-12 shadow-ambient-lg page-enter">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="no-underline">
            <h2 className="font-headline text-3xl text-on-surface">
              <em className="italic">MAISON</em>
              <span className="font-light not-italic">elle</span>
            </h2>
          </Link>
          <p className="label-atelier text-outline mt-2 !mb-0">
            Create Your Atelier Account
          </p>
        </div>

        {/* Error */}
        {errors.submit && (
          <div className="mb-6 py-3 px-5 bg-error-container/30 rounded-2xl">
            <p className="text-sm text-error">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="reg-fullname" className="label-atelier">Full Name</label>
            <input id="reg-fullname" name="fullname" type="text" value={formData.fullname} onChange={handleChange} placeholder="Eleanor Vance" className={`input-atelier ${errors.fullname ? "input-error" : ""}`} />
            {errors.fullname && <p className="text-error text-xs mt-2 ml-4">{errors.fullname}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="label-atelier">Email Address</label>
            <input id="reg-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`input-atelier ${errors.email ? "input-error" : ""}`} />
            {errors.email && <p className="text-error text-xs mt-2 ml-4">{errors.email}</p>}
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="reg-contact" className="label-atelier">Contact Number</label>
            <input id="reg-contact" name="contact" type="tel" value={formData.contact} onChange={handleChange} placeholder="+91 98765 43210" className={`input-atelier ${errors.contact ? "input-error" : ""}`} />
            {errors.contact && <p className="text-error text-xs mt-2 ml-4">{errors.contact}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="label-atelier">Password</label>
            <div className="relative">
              <input id="reg-password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="••••••••" className={`input-atelier pr-16 ${errors.password ? "input-error" : ""}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer text-xs uppercase tracking-wider font-medium">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {formData.password && (
              <div className="mt-3 ml-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[0.6rem] uppercase tracking-wider text-outline">Strength</span>
                  <span className="text-[0.6rem] uppercase tracking-wider text-on-surface-variant font-medium">{strength.text}</span>
                </div>
                <div className="w-full bg-surface-high rounded-full h-1">
                  <div className={`h-1 rounded-full transition-all duration-500 ${strength.color}`} style={{ width: `${(strength.level / 5) * 100}%` }} />
                </div>
              </div>
            )}
            {errors.password && <p className="text-error text-xs mt-2 ml-4">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="reg-confirm-password" className="label-atelier">Confirm Password</label>
            <div className="relative">
              <input id="reg-confirm-password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={`input-atelier pr-16 ${errors.confirmPassword ? "input-error" : ""}`} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer text-xs uppercase tracking-wider font-medium">
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
            <input type="checkbox" id="isSeller" name="isSeller" checked={formData.isSeller} onChange={handleChange} className="checkbox-atelier" />
            <div>
              <label htmlFor="isSeller" className="text-sm font-medium text-on-surface cursor-pointer block">I am an artisan</label>
              <p className="text-[0.65rem] text-outline mt-0.5">Register as a seller to list your creations</p>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-pill btn-primary w-full text-sm py-3.5">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner-atelier !w-4 !h-4 !border-white/30 !border-t-white" />
                Creating Account...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="text-[0.6rem] uppercase tracking-[0.15em] text-outline">or</span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        <GoogleLogin />

        <p className="text-center text-sm text-outline mt-6 font-light">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary font-medium no-underline hover:opacity-80 transition-opacity">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
