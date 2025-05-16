import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { auth } from "../firebase";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/seller/products`, {
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
      setProducts(data.products || []);
    } catch (err) {
      setError("Failed to fetch products: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/seller/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        }
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const startEdit = (prod) => {
    setEditingId(prod.id);
    setEditForm({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      image: prod.image,
      price: prod.price,
      inStock: prod.inStock,
      description: prod.description,
      quantity: prod.quantity,
      sizes: (prod.sizes || []).join(","),
      event: prod.event,
    });
    setEditError("");
  };

  const handleEditChange = e => {
    const { name, value, type, checked } = e.target;
    setEditForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/seller/products/${editingId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editForm,
          price: parseFloat(editForm.price),
          quantity: parseInt(editForm.quantity, 10),
          sizes: editForm.sizes.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setEditError("Failed to update: " + err.message);
    }
    setEditLoading(false);
  };

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: "#000" }}>My Products</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#c00" }}>{error}</div>}
      {!loading && products.length === 0 && (
        <div style={{ color: "#888", fontSize: 18, background: "#f5f5f5", borderRadius: 10, padding: 32, border: "1px solid #eee" }}>
          No products yet. Add your first product!
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {products.map(prod => (
          <div key={prod.id} style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 16,
            width: 260,
            background: "#fafafa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            {editingId === prod.id ? (
              <form onSubmit={handleEditSubmit} style={{ width: "100%" }}>
                <input style={inputStyle} name="name" value={editForm.name} onChange={handleEditChange} required />
                <input style={inputStyle} name="brand" value={editForm.brand} onChange={handleEditChange} required />
                <input style={inputStyle} name="category" value={editForm.category} onChange={handleEditChange} required />
                <input style={inputStyle} name="image" value={editForm.image} onChange={handleEditChange} required />
                <input style={inputStyle} name="price" value={editForm.price} onChange={handleEditChange} type="number" min="0" step="0.01" required />
                <input style={inputStyle} name="quantity" value={editForm.quantity} onChange={handleEditChange} type="number" min="1" required />
                <input style={inputStyle} name="sizes" value={editForm.sizes} onChange={handleEditChange} />
                <textarea style={{ ...inputStyle, height: 60 }} name="description" value={editForm.description} onChange={handleEditChange} />
                <label style={{ display: "block", margin: "8px 0" }}>
                  <input type="checkbox" name="inStock" checked={editForm.inStock} onChange={handleEditChange} />
                  <span style={{ marginLeft: 8 }}>In Stock</span>
                </label>
                <button type="submit" style={buttonStyle} disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save"}
                </button>
                <button type="button" style={{ ...buttonStyle, background: "#f5f5f5", color: "#000", marginTop: 8 }} onClick={() => setEditingId(null)}>
                  Cancel
                </button>
                {editError && <div style={{ color: "#c00", marginTop: 8 }}>{editError}</div>}
              </form>
            ) : (
              <>
                <img
                  src={prod.image}
                  alt={prod.name}
                  style={{ width: 120, height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 12, background: "#f5f5f5" }}
                  onError={e => (e.target.src = "https://placehold.co/120x160?text=No+Image")}
                />
                <div style={{ fontWeight: 600, fontSize: 16 }}>{prod.name}</div>
                <div style={{ color: "#666", fontSize: 14 }}>{prod.brand}</div>
                <div style={{ color: "#222", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>${prod.price}</div>
                <div style={{ color: prod.inStock ? "#080" : "#c00", fontWeight: 500, fontSize: 14 }}>
                  {prod.inStock ? "In Stock" : "Out of Stock"}
                </div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>{prod.category}</div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
                  {prod.sizes && prod.sizes.length > 0 ? `Sizes: ${prod.sizes.join(", ")}` : "No sizes"}
                </div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
                  {typeof prod.quantity !== "undefined" ? `Quantity: ${prod.quantity}` : ""}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button style={buttonStyle} onClick={() => startEdit(prod)}>Edit</button>
                  <button style={{ ...buttonStyle, background: "#c00" }} onClick={() => handleDelete(prod.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 8,
  borderRadius: 8,
  border: "1px solid #000",
  marginBottom: 8,
  fontSize: 15,
  boxSizing: "border-box"
};

const buttonStyle = {
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer"
};