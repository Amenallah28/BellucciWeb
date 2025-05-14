import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { signOut, updatePassword } from "firebase/auth";
import { auth } from "../firebase";
import { API_BASE_URL } from "../config";

Modal.setAppElement("#root");

export default function ProfilePage() {
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE_URL}/api/user/me`, {
          headers: {
            "Authorization": `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
          }
        });
        const data = await res.json();
        setProfile(data);
        setForm({
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          business_name: data.business_name || "",
          description: data.description || "",
          phone: data.phone || "",
        });
      } catch (e) {
        setError("Failed to load profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/user/me`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      const updated = await res.json();
      setProfile(updated);
      setSuccess("Profile updated!");
      setShowEdit(false);
    } catch (err) {
      setError("Failed to update: " + err.message);
    }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    try {
      if (!newPassword || newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        return;
      }
      await updatePassword(auth.currentUser, newPassword);
      setPasswordSuccess("Password updated successfully!");
      setShowChangePassword(false);
      setNewPassword("");
    } catch (err) {
      setPasswordError("Failed to update password: " + err.message);
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading profile...</div>;

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
      <div style={{ marginBottom: 10 }}>
        <div><b>Email:</b> {profile.email}</div>
        {profile.role !== "seller" && (
          <>
            <div><b>First Name:</b> {profile.first_name}</div>
            <div><b>Last Name:</b> {profile.last_name}</div>
          </>
        )}
        {profile.role === "seller" && (
          <>
            <div><b>Business Name:</b> {profile.business_name}</div>
            <div><b>Description:</b> {profile.description}</div>
            <div><b>Phone:</b> {profile.phone}</div>
          </>
        )}
      </div>
      <button
        style={{
          background: "#f0f0f0",
          padding: "10px 20px",
          borderRadius: 8,
          marginBottom: 10,
          color: "#000",
          fontWeight: 600,
          fontSize: 16,
          border: "none",
          cursor: "pointer"
        }}
        onClick={() => setShowEdit(true)}
      >
        Edit Profile
      </button>
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
        onClick={() => setShowChangePassword(true)}
      >
        Change Password
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
      {error && <div style={{ color: "#c00", marginTop: 10 }}>{error}</div>}
      {success && <div style={{ color: "#080", marginTop: 10 }}>{success}</div>}
      {passwordError && <div style={{ color: "#c00", marginTop: 10 }}>{passwordError}</div>}
      {passwordSuccess && <div style={{ color: "#080", marginTop: 10 }}>{passwordSuccess}</div>}

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onRequestClose={() => setShowEdit(false)}
        contentLabel="Edit Profile"
        style={{
          content: {
            maxWidth: 400,
            margin: "auto",
            borderRadius: 16,
            padding: 24,
          },
        }}
      >
        <h2>Edit Profile</h2>
        <form onSubmit={handleSave}>
          <input
            style={inputStyle}
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {profile.role !== "seller" && (
            <>
              <input
                style={inputStyle}
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
              />
              <input
                style={inputStyle}
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
              />
            </>
          )}
          {profile.role === "seller" && (
            <>
              <input
                style={inputStyle}
                name="business_name"
                placeholder="Business Name"
                value={form.business_name}
                onChange={handleChange}
              />
              <textarea
                style={{ ...inputStyle, height: 60 }}
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />
              <input
                style={inputStyle}
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
              />
            </>
          )}
          <button type="submit" style={buttonStyle} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
        <button
          style={{ ...buttonStyle, background: "#f5f5f5", color: "#000", marginTop: 8 }}
          onClick={() => setShowEdit(false)}
        >
          Cancel
        </button>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePassword}
        onRequestClose={() => setShowChangePassword(false)}
        contentLabel="Change Password"
        style={{
          content: {
            maxWidth: 400,
            margin: "auto",
            borderRadius: 16,
            padding: 24,
          },
        }}
      >
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <input
            style={inputStyle}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" style={buttonStyle}>
            Update Password
          </button>
        </form>
        <button
          style={{ ...buttonStyle, background: "#f5f5f5", color: "#000", marginTop: 8 }}
          onClick={() => setShowChangePassword(false)}
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #000",
  marginBottom: 12,
  fontSize: 16,
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  background: "#000",
  color: "#fff",
  padding: 12,
  borderRadius: 8,
  fontWeight: 600,
  border: "none",
  fontSize: 16,
  cursor: "pointer"
};