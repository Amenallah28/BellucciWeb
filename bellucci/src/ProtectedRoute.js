import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  console.log("ProtectedRoute:", { user, loading });
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
}