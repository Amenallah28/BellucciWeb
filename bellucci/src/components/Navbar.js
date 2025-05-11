import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { API_BASE_URL } from "../config";
import { auth } from "../firebase";

const navStyle = {
  display: "flex",
  gap: 24,
  padding: "16px 32px",
  background: "#fff",
  borderBottom: "1px solid #eee",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const navLinkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "#fff" : "#222",
  background: isActive ? "#000" : "none",
  fontWeight: 600,
  fontSize: 18,
  padding: "6px 12px",
  borderRadius: 6,
});

export default function Navbar() {
  const { user } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        return;
      }
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/user/me`, {
          headers: {
            "Authorization": `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
          }
        });
        if (!res.ok) {
          setRole(null);
          return;
        }
        const data = await res.json();
        setRole(data.role);
      } catch {
        setRole(null);
      }
    };
    fetchRole();
  }, [user]);

  if (!user) return null; // Hide navbar if not logged in

  if (role === "seller") {
  return (
    <nav style={navStyle}>
      <NavLink to="/seller-dashboard" style={navLinkStyle}>Dashboard</NavLink>
      <NavLink to="/seller-products" style={navLinkStyle}>My Products</NavLink>
      <NavLink to="/seller-add-product" style={navLinkStyle}>Add Product</NavLink>
      <NavLink to="/seller-orders" style={navLinkStyle}>Orders</NavLink>
      <NavLink to="/trends" style={navLinkStyle}>Trends</NavLink>
      <NavLink to="/profile" style={navLinkStyle}>Profile</NavLink>
      <NavLink to="/contact" style={navLinkStyle}>Contact Us</NavLink>
    </nav>
  );
}

  // Buyer nav
  return (
    <nav style={navStyle}>
      <NavLink to="/home" style={navLinkStyle}>Home</NavLink>
      <NavLink to="/closet" style={navLinkStyle}>Closet</NavLink>
      <NavLink to="/cart" style={navLinkStyle}>Cart</NavLink>
      <NavLink to="/trends" style={navLinkStyle}>Trends</NavLink>
      <NavLink to="/profile" style={navLinkStyle}>Profile</NavLink>
      <NavLink to="/contact" style={navLinkStyle}>Contact Us</NavLink>
    </nav>
  );
}
