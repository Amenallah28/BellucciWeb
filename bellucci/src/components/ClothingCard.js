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
    width: '90vw',
    maxWidth: 400,
    height: '70vh',
    maxHeight: 600,
    borderRadius: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    background: "#fff",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    margin: '0 auto',
  },
  image: {
    width: "100%",
    height: "80%",
    objectFit: "cover",
    background: "#f5f5f5",
  },
  saveButton: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "rgba(255,255,255,0.9)",
    border: "none",
    borderRadius: "50%",
    padding: 8,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: 20,
    height: '20%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 6,
  },
  brand: {
    color: "#666",
    fontSize: 16,
    marginBottom: 6,
  },
  price: {
    color: "#222",
    fontWeight: "600",
    fontSize: 18,
  },
};

export default ClothingCard;