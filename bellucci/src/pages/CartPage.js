// ... existing imports ...
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { API_BASE_URL } from "../config";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

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

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        }
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setOrderSuccess("");
    setOrderError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order failed");
      }
      setOrderSuccess("Order placed successfully! 🎉");
      setCartItems([]); // Clear cart in UI
      fetchOrders(); // Refresh order history
    } catch (err) {
      setOrderError("Failed to place order: " + err.message);
    }
    setPlacingOrder(false);
  };

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          {orderSuccess && <div style={{ color: "#080", marginTop: 16 }}>{orderSuccess}</div>}
          {orderError && <div style={{ color: "#c00", marginTop: 16 }}>{orderError}</div>}
        </div>
      ) : (
        <>
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
          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            style={{
              marginTop: 32,
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "15px 30px",
              fontWeight: 600,
              fontSize: 18,
              cursor: "pointer"
            }}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
          {orderSuccess && <div style={{ color: "#080", marginTop: 16 }}>{orderSuccess}</div>}
          {orderError && <div style={{ color: "#c00", marginTop: 16 }}>{orderError}</div>}
        </>
      )}

      {/* Order History Section */}
      <div style={{ marginTop: 48 }}>
        <h3>🧾 Your Orders</h3>
        {ordersLoading ? (
          <div>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ color: "#888" }}>No orders yet.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {orders.map(order => (
              <div key={order._id} style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 16,
                width: 320,
                background: "#fafafa",
                display: "flex",
                flexDirection: "column",
                marginBottom: 16
              }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                  Order #{order._id.slice(-6).toUpperCase()}
                </div>
                <div style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>
                  Status: <b>{order.status}</b>
                </div>
                <div>
                  <b>Items:</b>
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id}>
                        {item.name} (${item.price})
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ fontWeight: 600, marginTop: 8 }}>
                  Total: ${order.total}
                </div>
                <div style={{ color: "#aaa", fontSize: 12, marginTop: 8 }}>
                  Placed: {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}