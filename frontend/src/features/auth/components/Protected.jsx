import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children, role = "buyer" }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center page-enter">
          <div className="spinner-atelier mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.15em] text-outline">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== role) {
    console.warn(
      `Access denied: User role '${user?.role}' does not match required role '${role}'`
    );
    return <Navigate to="/" />;
  }

  return children;
};

export default Protected;
