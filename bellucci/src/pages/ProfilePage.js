import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function ProfilePage() {
  return (
    <div style={{
      padding: 32,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <img
        src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256"
        alt="Profile"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          marginBottom: 15,
          border: "2px solid #000",
          objectFit: "cover"
        }}
        onError={e => (e.target.src = "https://placehold.co/120x120?text=No+Image")}
      />
      <span style={{ fontSize: 32, marginBottom: 5 }}>👤</span>
      <h2 style={{ fontWeight: "bold", marginBottom: 10 }}>Profile</h2>
      <button
        style={{
          background: "#f0f0f0",
          padding: "10px 20px",
          borderRadius: 8,
          marginBottom: 15,
          color: "#000",
          fontWeight: 600,
          fontSize: 16,
          border: "none",
          cursor: "pointer"
        }}
        onClick={() => alert('Edit Profile feature coming soon! 💅')}
      >
        Edit Profile
      </button>
      <button
        onClick={() => signOut(auth)}
        style={{
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "15px 30px",
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        Log Out
      </button>
    </div>
  );
}