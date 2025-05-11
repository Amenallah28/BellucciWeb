import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { API_BASE_URL } from "../config";

export default function SellerRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSellerRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // 2. Register user in backend with role: "seller"
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_uid: userCredential.user.uid,
          email: userCredential.user.email,
          business_name: businessName,
          description: description,
          phone: phone,
          role: "seller",
          preferences: {}
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend error: ${errorText}`);
      }

      // 3. Go to seller dashboard
      navigate("/seller-dashboard", { replace: true });
    } catch (error) {
      alert("Registration error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 16,
      padding: 32,
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Seller Registration</h2>
      <form onSubmit={handleSellerRegister}>
        <input
          style={inputStyle}
          placeholder="Business Name"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          required
        />
        <textarea
          style={{ ...inputStyle, height: 80 }}
          placeholder="Business Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          type="tel"
          required
        />
        <input
          style={inputStyle}
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          style={inputStyle}
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
        />
        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register as Seller"}
        </button>
      </form>
      <button
        style={{ ...buttonStyle, background: "#f5f5f5", color: "#000", marginTop: 12 }}
        onClick={() => navigate("/")}
        type="button"
      >
        Back to Login
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #000",
  marginBottom: 16,
  fontSize: 16,
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  background: "#000",
  color: "#fff",
  padding: 14,
  borderRadius: 8,
  fontWeight: 600,
  border: "none",
  fontSize: 16,
  cursor: "pointer"
};