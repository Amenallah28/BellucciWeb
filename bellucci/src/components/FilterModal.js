import React from "react";
import Modal from "react-modal";
import Slider from "rc-slider";
import Switch from "react-switch";
import "rc-slider/assets/index.css";

Modal.setAppElement("#root");

export default function FilterModal({
  isOpen,
  onRequestClose,
  priceRange,
  setPriceRange,
  selectedCategories,
  toggleCategory,
  categories,
  selectedBrands,
  toggleBrand,
  brands,
  inStockOnly,
  setInStockOnly,
  applyFilters,
  resetFilters,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Filters"
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
      <h2>Filters</h2>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Price Range</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
        <Slider
          range
          min={0}
          max={999}
          step={10}
          value={priceRange}
          onChange={setPriceRange}
          style={{ marginTop: 10 }}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Categories</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid #ddd",
                background: selectedCategories.includes(cat) ? "#000" : "#fff",
                color: selectedCategories.includes(cat) ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Brands</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => toggleBrand(brand)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid #ddd",
                background: selectedBrands.includes(brand) ? "#000" : "#fff",
                color: selectedBrands.includes(brand) ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 600 }}>In Stock Only</span>
        <Switch
          checked={inStockOnly}
          onChange={setInStockOnly}
          onColor="#000"
          offColor="#ccc"
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button
          onClick={resetFilters}
          style={{
            flex: 1,
            background: "#f5f5f5",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        <button
          onClick={applyFilters}
          style={{
            flex: 1,
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Apply Filters
        </button>
      </div>
    </Modal>
  );
}