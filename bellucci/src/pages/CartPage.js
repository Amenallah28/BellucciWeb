import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { API_BASE_URL } from "../config";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/cart`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
          }
        });
        const data = await res.json();
        setCartItems(data.cart || []);
      } catch (error) {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>🛒 Your Cart</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {cartItems.map(item => (
          <div key={item.id} style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
            width: 220,
            background: "#fafafa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: 120, height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 12, background: "#f5f5f5" }}
              onError={e => (e.target.src = "https://placehold.co/120x160?text=No+Image")}
            />
            <div style={{ fontWeight: 600, fontSize: 16 }}>{item.name}</div>
            <div style={{ color: "#666", fontSize: 14 }}>{item.brand}</div>
            <div style={{ color: "#222", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>${item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}