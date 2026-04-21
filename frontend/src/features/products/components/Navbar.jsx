import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleSearchProducts, handleGetAllProducts } = useProduct();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [location.pathname]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Debounced search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await handleSearchProducts(query);
        setSearchResults(results || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearchProducts(searchQuery);
      setSearchOpen(false);
      setSearchResults([]);
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  const cartCount = cartItems?.length || 0;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-glass shadow-ambient py-3" : "bg-transparent py-5"
      }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex flex-col items-start no-underline group">
          <span className="font-headline text-2xl tracking-tight text-on-surface font-normal">
            MAISON<em className="not-italic font-light opacity-60">elle</em>
          </span>
          <span className="font-body text-[0.55rem] uppercase tracking-[0.3em] text-outline mt-[-2px]">
            The Curated Atelier
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            to="/"
            className={`btn-editorial no-underline transition-all ${
              isActive("/") ? "text-secondary !border-b-secondary" : ""
            }`}>
            Collection
          </Link>

          {user?.role === "seller" && (
            <>
              <Link
                to="/dashboard"
                className={`btn-editorial no-underline transition-all ${
                  isActive("/dashboard")
                    ? "text-secondary !border-b-secondary"
                    : ""
                }`}>
                Atelier
              </Link>
              <Link
                to="/products/create"
                className={`btn-editorial no-underline transition-all ${
                  isActive("/products/create")
                    ? "text-secondary !border-b-secondary"
                    : ""
                }`}>
                Create
              </Link>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-high transition-all cursor-pointer border-none bg-transparent text-on-surface-variant hover:text-on-surface"
              aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* Search Dropdown */}
            {searchOpen && (
              <div className="absolute right-0 top-full mt-3 w-96 bg-surface-lowest rounded-2xl shadow-ambient-lg page-enter overflow-hidden">
                <form onSubmit={handleSearchSubmit} className="p-4">
                  <div className="relative">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline">
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

                {/* Results */}
                {(searching || searchResults.length > 0 || (searchQuery && !searching)) && (
                  <div className="border-t border-outline-variant/10">
                    {searching ? (
                      <div className="p-6 flex items-center justify-center gap-3">
                        <div className="spinner-atelier !w-4 !h-4" />
                        <span className="text-xs text-outline uppercase tracking-wider">Searching...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto py-2">
                        {searchResults.slice(0, 6).map((product) => (
                          <button
                            key={product._id}
                            onClick={() => {
                              navigate(`/products/${product._id}`);
                              setSearchOpen(false);
                              setSearchResults([]);
                              setSearchQuery("");
                            }}
                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-low transition-colors text-left bg-transparent border-none cursor-pointer">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-high shrink-0">
                              {product.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="font-headline italic text-outline-variant text-[0.5rem]">N/A</span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-on-surface font-medium line-clamp-1">{product.title}</p>
                              <p className="text-xs text-outline font-light mt-0.5">
                                {product.price?.currency} {product.price?.amount?.toLocaleString()}
                              </p>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-outline-variant shrink-0">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </button>
                        ))}
                        {searchResults.length > 6 && (
                          <div className="px-4 py-3 text-center">
                            <button
                              onClick={handleSearchSubmit}
                              className="text-xs text-secondary font-medium uppercase tracking-wider bg-transparent border-none cursor-pointer hover:opacity-70">
                              View all {searchResults.length} results →
                            </button>
                          </div>
                        )}
                      </div>
                    ) : searchQuery.trim() ? (
                      <div className="p-6 text-center">
                        <p className="font-headline italic text-outline-variant text-base mb-1">No results</p>
                        <p className="text-[0.65rem] text-outline">Try a different search term</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-high transition-all no-underline text-on-surface-variant hover:text-on-surface"
                aria-label="Cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

              {/* User */}
              <div className="flex items-center gap-3 ml-1">
                <div className="text-right">
                  <p className="text-xs font-medium text-on-surface leading-tight">
                    {user.fullname}
                  </p>
                  <p className="text-[0.6rem] uppercase tracking-[0.12em] text-outline">
                    {user.role}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="text-sm text-on-primary">
                    {user.fullname?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="btn-editorial cursor-pointer bg-transparent border-none">
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn-pill btn-primary text-xs">
                Join Atelier
              </button>
            </div>
          )}
        </div>

        {/* Mobile Right Icons */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-high transition-all cursor-pointer border-none bg-transparent text-on-surface-variant"
            aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* Mobile Cart */}
          {user && (
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-high transition-all no-underline text-on-surface-variant"
              aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

          {/* Hamburger */}
          <button
            className="flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu">
            <span className={`block w-5 h-[1.5px] bg-on-surface transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-on-surface transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-on-surface transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Search Panel */}
      {searchOpen && (
        <div ref={searchRef} className="md:hidden mx-4 mt-2 bg-surface-lowest rounded-2xl shadow-ambient-lg page-enter overflow-hidden">
          <form onSubmit={handleSearchSubmit} className="p-4">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={!searchOpen ? null : searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search the collection..."
                className="input-atelier pl-11 text-sm"
              />
            </div>
          </form>
          {searching ? (
            <div className="px-4 pb-4 flex items-center justify-center gap-3">
              <div className="spinner-atelier !w-4 !h-4" />
              <span className="text-xs text-outline uppercase tracking-wider">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-64 overflow-y-auto border-t border-outline-variant/10 py-2">
              {searchResults.slice(0, 5).map((product) => (
                <button
                  key={product._id}
                  onClick={() => {
                    navigate(`/products/${product._id}`);
                    setSearchOpen(false);
                    setSearchResults([]);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-low transition-colors text-left bg-transparent border-none cursor-pointer">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-high shrink-0">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surface-high" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-on-surface font-medium line-clamp-1">{product.title}</p>
                    <p className="text-xs text-outline font-light">
                      {product.price?.currency} {product.price?.amount?.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.trim() && !searching ? (
            <div className="px-4 pb-4 text-center">
              <p className="text-sm text-outline-variant italic">No results found</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-6 shadow-ambient-lg page-enter">
          <div className="flex flex-col gap-4">
            <Link to="/" className="btn-editorial no-underline text-center">
              Collection
            </Link>
            {user?.role === "seller" && (
              <>
                <Link to="/dashboard" className="btn-editorial no-underline text-center">
                  Atelier
                </Link>
                <Link to="/products/create" className="btn-editorial no-underline text-center">
                  Create
                </Link>
              </>
            )}
            <div className="tonal-divider" />
            {user ? (
              <div className="text-center">
                <p className="text-sm font-medium">{user.fullname}</p>
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
                  Join Atelier
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
