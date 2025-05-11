import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import ClothingSwiper from '../components/ClothingSwiper';
import ItemDetailsModal from '../components/ItemDetailsModal';
import FilterModal from '../components/FilterModal';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";

function HomePage() {
  const [clothingItems, setClothingItems] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter/search state
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 999]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/clothing-items`)
      .then(res => res.json())
      .then(data => {
        setClothingItems(data.clothing_items || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchCloset = async () => {
      if (!auth.currentUser) return;
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/closet`, {
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        }
      });
      const data = await res.json();
      setSavedIds((data.closet || []).map(item => item.id));
    };
    fetchCloset();
  }, []);

  const handleSaveToggle = async (itemId, nowSaved) => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();
    const endpoint = nowSaved ? '/api/closet/add' : '/api/closet/remove';
    await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebase_uid: auth.currentUser.uid,
        item_id: itemId,
      }),
    });
    setSavedIds(prev =>
      nowSaved ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  const handleSwipe = async (direction, item) => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();
    try {
      if (direction === "up") {
        // Handle purchase
        const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            item_id: item.id
          }),
        });
        if (!response.ok) {
          const error = await response.json();
          console.error("Purchase failed:", error);
          return;
        }
        return;
      }
      // Handle likes/dislikes
      const interaction_type = direction === "right" ? "like" : "dislike";
      await fetch(`${API_BASE_URL}/api/interactions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: item.id,
          interaction_type,
        }),
      });
    } catch (error) {
      console.error("Swipe action failed:", error);
    }
  };

  // --- Filter/search logic ---
  // Get unique categories and brands from all clothing items
  const categories = Array.from(new Set(clothingItems.map(item => item.category).filter(Boolean)));
  const brands = Array.from(new Set(clothingItems.map(item => item.brand).filter(Boolean)));

  // Filtering logic
  const applyFilters = () => {
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSearchText("");
    setPriceRange([0, 999]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setShowFilters(false);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Compute filtered items
  const filteredItems = clothingItems.filter(item => {
    // Search text
    if (searchText &&
      !(
        (item.name && item.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.brand && item.brand.toLowerCase().includes(searchText.toLowerCase()))
      )
    ) {
      return false;
    }
    // Price range
    if (item.price < priceRange[0] || item.price > priceRange[1]) {
      return false;
    }
    // Categories
    if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
      return false;
    }
    // Brands
    if (selectedBrands.length > 0 && !selectedBrands.includes(item.brand)) {
      return false;
    }
    // In stock only
    if (inStockOnly && !item.inStock) {
      return false;
    }
    return true;
  });

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading clothing items...</p>
    </div>
  );

  if (!clothingItems.length) return (
    <div className="no-items">
      <h3>No items found!</h3>
      <p>Try refreshing or check back later</p>
    </div>
  );

  return (
    <div className="home-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search clothes..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') applyFilters(); }}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: 16,
            minWidth: 0
          }}
        />
        <button
          onClick={() => setShowFilters(true)}
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 18px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          Filters
        </button>
        <button
          onClick={() => signOut(auth)}
          style={{
            background: '#f5f5f5',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: '12px 18px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          Logout
        </button>
      </div>
      <h2 style={{ marginBottom: 16 }}>Welcome to Bellucci!</h2>
      <ClothingSwiper
        items={filteredItems}
        onSwipe={handleSwipe}
        savedIds={savedIds}
        onSaveToggle={handleSaveToggle}
        onCardClick={setSelectedItem}
      />
      <ItemDetailsModal
        isOpen={!!selectedItem}
        onRequestClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
      <FilterModal
        isOpen={showFilters}
        onRequestClose={() => setShowFilters(false)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        categories={categories}
        selectedBrands={selectedBrands}
        toggleBrand={toggleBrand}
        brands={brands}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />
    </div>
  );
}

export default HomePage;