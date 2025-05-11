import React from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

function ClothingCard({ item, isSaved, onSaveToggle, onClick }) {
  const handleSaveClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    e.preventDefault();  // Prevent default behavior
    onSaveToggle && onSaveToggle(item.id, !isSaved);
  };

  return (
    <div style={styles.card} onClick={onClick}>
      <img
        src={item.image}
        alt={item.name}
        style={styles.image}
        onError={e => (e.target.src = "https://placehold.co/300x400?text=No+Image")}
      />
      <button
        style={styles.saveButton}
        onClick={handleSaveClick}
        title={isSaved ? "Unsave" : "Save"}
        className="save-button"
      >
        {isSaved ? <FaBookmark color="#000" size={24} /> : <FaRegBookmark color="#888" size={24} />}
      </button>
      <div style={styles.info}>
        <div style={styles.name}>{item.name}</div>
        <div style={styles.brand}>{item.brand}</div>
        <div style={styles.price}>${item.price.toFixed(2)}</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: 280,
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    background: "#fff",
    margin: 16,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: 320,
    objectFit: "cover",
    background: "#f5f5f5",
  },
  saveButton: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    padding: 6,
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    zIndex: 10,
  },
  info: {
    padding: 16,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  brand: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    color: "#222",
    fontWeight: "600",
    fontSize: 16,
  },
};

export default ClothingCard;