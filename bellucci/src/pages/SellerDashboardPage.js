import React from "react";
import { useNavigate } from "react-router-dom";

export default function SellerDashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, color: "#000" }}>Welcome, Seller!</h2>
      <p style={{ fontSize: 18, color: "#444", marginBottom: 32 }}>
        This is your dashboard. You can add new products, view your products, and manage your orders.
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 40 }}>
        <button style={shortcutBtnStyle} onClick={() => navigate('/seller-add-product')}>Add Product</button>
        <button style={shortcutBtnStyle} onClick={() => navigate('/seller-products')}>View Products</button>
        <button style={shortcutBtnStyle} onClick={() => navigate('/seller-orders')}>View Orders</button>
      </div>
      <div style={{ background: "#f5f5f5", borderRadius: 10, padding: 32, color: "#888", fontSize: 18, border: "1px solid #eee" }}>
        No stats to show yet. Start by adding your first product!
      </div>
    </div>
  );
}

const shortcutBtnStyle = {
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "16px 32px",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  transition: "background 0.2s",
};
