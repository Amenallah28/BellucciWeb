import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { auth } from "../firebase";

const categories = [
  "Jackets", "Dresses", "T-shirt", "Coat", "Pants", "Shoes", "Accessories", "Shirts", "Skirts", "Hoodies", "Shorts"
];

export default function SellerAddProductPage() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    image: "",
    price: "",
    inStock: true,
    description: "",
    quantity: "",
    sizes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/seller/products`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity, 10),
          sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      setSuccess("Product added successfully!");
      setForm({
        name: "",
        brand: "",
        category: "",
        image: "",
        price: "",
        inStock: true,
        description: "",
        quantity: "",
        sizes: "",
      });
    } catch (err) {
      setError("Failed to add product: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input style={inputStyle} name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <input style={inputStyle} name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
        <select style={inputStyle} name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input style={inputStyle} name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
        <input style={inputStyle} name="price" placeholder="Price" value={form.price} onChange={handleChange} type="number" min="0" step="0.01" required />
        <input style={inputStyle} name="quantity" placeholder="Quantity in stock" value={form.quantity} onChange={handleChange} type="number" min="1" required />
        <input style={inputStyle} name="sizes" placeholder="Available sizes (comma separated, e.g. S,M,L)" value={form.sizes} onChange={handleChange} />
        <textarea style={{ ...inputStyle, height: 80 }} name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <label style={{ display: "block", margin: "12px 0" }}>
          <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} />
          <span style={{ marginLeft: 8 }}>In Stock</span>
        </label>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
      {success && <div style={{ color: "#080", marginTop: 16 }}>{success}</div>}
      {error && <div style={{ color: "#c00", marginTop: 16 }}>{error}</div>}
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