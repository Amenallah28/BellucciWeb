import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function ItemDetailsModal({ isOpen, onRequestClose, item }) {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Item Details"
      style={{
        content: {
          maxWidth: 400,
          margin: "auto",
          borderRadius: 16,
          padding: 24,
        },
      }}
    >
      <button
        onClick={onRequestClose}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "none",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
        }}
        title="Close"
      >
        &times;
      </button>
      <img
        src={item.image}
        alt={item.name}
        style={{ width: "100%", borderRadius: 12, marginBottom: 16 }}
      />
      <h2>{item.name}</h2>
      <div style={{ color: "#666", marginBottom: 8 }}>{item.brand}</div>
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>${item.price.toFixed(2)}</div>
      <div style={{ marginBottom: 8 }}>{item.description}</div>
      <div style={{ color: "#888" }}>Category: {item.category}</div>
      <div style={{ color: "#888" }}>Event: {item.event}</div>
      <div style={{ color: item.inStock ? "#080" : "#c00", marginTop: 8 }}>
        {item.inStock ? "In Stock" : "Out of Stock"}
      </div>
    </Modal>
  );
}