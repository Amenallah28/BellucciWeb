import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { auth } from "../firebase";

const ORDER_STATUSES = ["pending", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = {
  pending: "#ff9800",
  shipped: "#2196f3",
  delivered: "#4caf50",
  cancelled: "#f44336"
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/seller/orders`, {
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        }
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError("Failed to fetch orders: " + err.message);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/seller/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        alert("Failed to update status");
        return;
      }
      // Update status in UI
      setOrders(orders =>
        orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
    setUpdatingOrderId(null);
  };

  return (
    <div style={{ padding: 32, background: "#f7f7f9", minHeight: "100vh" }}>
      <h2 style={{
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 32,
        color: "#222",
        letterSpacing: 1
      }}>Orders</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#c00" }}>{error}</div>}
      {!loading && orders.length === 0 && (
        <div style={{
          color: "#888",
          fontSize: 18,
          background: "#fff",
          borderRadius: 10,
          padding: 32,
          border: "1px solid #eee",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          No orders yet.
        </div>
      )}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 32,
        justifyContent: "flex-start"
      }}>
        {orders.map(order => (
          <div key={order._id} style={{
            border: "1px solid #e0e0e0",
            borderRadius: 16,
            padding: 24,
            width: 350,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            transition: "box-shadow 0.2s"
          }}>
            <div style={{
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 8,
              color: "#222"
            }}>
              Order #{order._id.slice(-6).toUpperCase()}
            </div>
            <div style={{
              color: "#666",
              fontSize: 15,
              marginBottom: 8,
              fontWeight: 500
            }}>
              Buyer: <span style={{ color: "#111" }}>{order.buyer_name || order.buyer_email || order.buyer_id}</span>
            </div>
            <div style={{
              color: "#888",
              fontSize: 15,
              marginBottom: 12,
              display: "flex",
              alignItems: "center"
            }}>
              Status:
              <span style={{
                marginLeft: 8,
                fontWeight: 600,
                color: STATUS_COLORS[order.status] || "#888",
                textTransform: "capitalize"
              }}>
                {order.status}
              </span>
              <select
                value={order.status}
                onChange={e => handleStatusChange(order._id, e.target.value)}
                disabled={updatingOrderId === order._id}
                style={{
                  marginLeft: 12,
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: "#f5f5f5",
                  fontWeight: 600,
                  color: "#222",
                  cursor: "pointer"
                }}
              >
                {ORDER_STATUSES.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 8 }}>
              <b>Items:</b>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: 18 }}>
                {order.items.map(item => (
                  <li key={item.id} style={{ fontSize: 15 }}>
                    {item.name} <span style={{ color: "#888" }}>(${item.price})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{
              fontWeight: 700,
              marginTop: 8,
              fontSize: 16,
              color: "#222"
            }}>
              Total: ${order.total}
            </div>
            <div style={{
              color: "#aaa",
              fontSize: 13,
              marginTop: 10,
              textAlign: "right"
            }}>
              Placed: {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}