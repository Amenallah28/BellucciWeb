import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "./config";
import { auth } from "./firebase";

export default function SellerProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/user/me`, {
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        }
      });
      if (!res.ok) {
        setChecking(false);
        setIsSeller(false);
        return;
      }
      const data = await res.json();
      setIsSeller(data.role === "seller");
      setChecking(false);
    };
    checkRole();
  }, [user]);

  if (loading || checking) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (!isSeller) return <Navigate to="/home" />;
  return children;
}