import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { API_BASE_URL } from "../config";

export default function ClosetPage() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedItems = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/closet`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
          }
        });
        const data = await res.json();
        setSavedItems(data.closet || []);
      } catch (error) {
        setSavedItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedItems();
  }, []);

  const handleUnsave = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      await fetch(`${API_BASE_URL}/api/closet/remove`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          item_id: itemId
        })
      });
      setSavedItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      alert('Failed to unsave item');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <p>Loading your closet...</p>
      </div>
    );
  }

  if (savedItems.length === 0) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Closet</h2>
        <p>Your closet is empty. Save items to see them here!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>👗 Your Closet</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {savedItems.map(item => (
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
            <button
              onClick={() => handleUnsave(item.id)}
              style={{
                background: "#fff",
                color: "#000",
                border: "1px solid #000",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 8
              }}
            >
              Unsave
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}