import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesktop = desktopSearchRef.current?.contains(e.target);
      const inMobile = mobileSearchRef.current?.contains(e.target);
      if (!inDesktop && !inMobile) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/collections?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const cartCount = cartItems?.length || 0;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-glass shadow-ambient py-3" : "bg-transparent py-5"
      }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-baseline gap-0 no-underline group">
          <span className="font-headline text-xl tracking-tight text-on-surface italic">
            MAISON
          </span>
          <span className="font-headline text-xl tracking-tight text-on-surface font-light not-italic">
            elle
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 ml-10">
          <Link
            to="/"
            className={`btn-editorial no-underline transition-all ${
              location.pathname === "/"
                ? "text-secondary !border-b-secondary"
                : ""
            }`}>
            Shop
          </Link>
          {user?.role === "seller" && (
            <>
              <Link
                to="/dashboard"
                className={`btn-editorial no-underline transition-all ${
                  location.pathname === "/dashboard"
                    ? "text-secondary !border-b-secondary"
                    : ""
                }`}>
                Atelier
              </Link>
              <Link
                to="/products/create"
                className={`btn-editorial no-underline transition-all ${
                  location.pathname === "/products/create"
                    ? "text-secondary !border-b-secondary"
                    : ""
                }`}>
                Create
              </Link>
            </>
          )}
          <Link to="/collections" className="btn-editorial no-underline">
            Collections
          </Link>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <div ref={desktopSearchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-high transition-all cursor-pointer border-none bg-transparent text-on-surface-variant hover:text-on-surface"
              aria-label="Search">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-3 w-96 bg-surface-lowest rounded-2xl shadow-ambient-lg page-enter overflow-hidden">
                <form onSubmit={handleSearchSubmit} className="p-4">
                  <div className="relative">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search the collection..."
                      className="input-atelier pl-11 text-sm"
                    />
                  </div>
                </form>
                <div className="px-4 pb-3">
                  <p className="text-[0.6rem] text-outline uppercase tracking-wider">
                    Press Enter to search
                  </p>
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-high transition-all no-underline text-on-surface-variant hover:text-on-surface"
                aria-label="Cart">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[0.55rem] font-semibold flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center cursor-pointer">
                  <span className="text-sm text-on-primary font-headline">
                    {user.fullname?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="btn-pill btn-primary text-xs">
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Mobile Right */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-high transition-all cursor-pointer border-none bg-transparent text-on-surface-variant"
            aria-label="Search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          {user && (
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-high transition-all no-underline text-on-surface-variant"
              aria-label="Cart">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[0.55rem] font-semibold flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}
          <button
            className="flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu">
            <span
              className={`block w-5 h-[1.5px] bg-on-surface transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[5px]" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-on-surface transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-on-surface transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div
          ref={mobileSearchRef}
          className="md:hidden mx-4 mt-2 bg-surface-lowest rounded-2xl shadow-ambient-lg page-enter overflow-hidden">
          <form onSubmit={handleSearchSubmit} className="p-4">
            <div className="relative">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search the collection..."
                className="input-atelier pl-11 text-sm"
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-6 shadow-ambient-lg page-enter">
          <div className="flex flex-col gap-4">
            <Link to="/" className="btn-editorial no-underline text-center">
              Shop
            </Link>
            <Link to="/" className="btn-editorial no-underline text-center">
              Collections
            </Link>
            {user?.role === "seller" && (
              <>
                <Link
                  to="/dashboard"
                  className="btn-editorial no-underline text-center">
                  Atelier
                </Link>
                <Link
                  to="/products/create"
                  className="btn-editorial no-underline text-center">
                  Create
                </Link>
              </>
            )}
            <div className="tonal-divider" />
            {user ? (
              <div className="text-center">
                <p className="text-sm font-medium text-on-surface">
                  {user.fullname}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.12em] text-outline">
                  {user.role}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="btn-pill btn-primary w-full">
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="btn-pill bg-transparent text-on-surface w-full ghost-border">
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
