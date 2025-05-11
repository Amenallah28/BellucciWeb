import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const trendData = [
  {
    name: 'Old Money Luxe',
    image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=500',
    category: 'men',
    description: 'Silk shirts & tailored trousers'
  },
  {
    name: 'Minimalist Street',
    image: 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&w=500',
    category: 'men',
    description: 'Clean lines, neutral colors, and simple sneakers'
  },
  {
    name: 'Smart Casual',
    image: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&w=500',
    category: 'men',
    description: 'Blazers, chinos, and loafers for a polished look'
  },
  {
    name: 'Soft Pastels',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&w=500',
    category: 'women',
    description: 'Pastel dresses and light accessories'
  },
  {
    name: 'Power Suits',
    image: 'https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg?auto=compress&w=500',
    category: 'women',
    description: 'Bold, tailored suits in vibrant colors'
  },
  {
    name: 'Boho Chic',
    image: 'https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&w=500',
    category: 'women',
    description: 'Flowy dresses, floral prints, and layered jewelry'
  }
];

const eventImages = {
  "Date Night": "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&w=500",
  "Casual": "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&w=500",
  "Party": "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&w=500",
  "Wedding": "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&w=500",
  "Work": "https://images.pexels.com/photos/1138903/pexels-photo-1138903.jpeg?auto=compress&w=500",
  "Summer": "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&w=500",
  "Winter": "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&w=500"
};

export default function TrendsPage() {
  const [activeTab, setActiveTab] = useState('Trending');
  const [genderFilter, setGenderFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventItems, setEventItems] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingEventItems, setLoadingEventItems] = useState(false);

  // Fetch events when Events tab is active
  useEffect(() => {
    if (activeTab === 'Events') {
      setLoadingEvents(true);
      fetch(`${API_BASE_URL}/api/events`)
        .then(res => res.json())
        .then(data => setEvents(data.events || []))
        .catch(() => setEvents([]))
        .finally(() => setLoadingEvents(false));
    }
  }, [activeTab]);

  // Fetch items for selected event
  useEffect(() => {
    if (selectedEvent) {
      setLoadingEventItems(true);
      fetch(`${API_BASE_URL}/api/events/${encodeURIComponent(selectedEvent)}`)
        .then(res => res.json())
        .then(data => setEventItems(data.items || []))
        .catch(() => setEventItems([]))
        .finally(() => setLoadingEventItems(false));
    }
  }, [selectedEvent]);

  const filteredData = (activeTab === 'Trending' ? trendData : []).filter(item =>
    genderFilter === 'all' || item.category === genderFilter || item.category === 'unisex'
  );

  return (
    <div style={{ padding: 32 }}>
      {/* Main Tabs */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => { setActiveTab('Trending'); setSelectedEvent(null); }}
          style={{
            padding: "10px 25px",
            borderRadius: 20,
            background: activeTab === 'Trending' ? "#000" : "#f0f0f0",
            color: activeTab === 'Trending' ? "#fff" : "#555",
            fontWeight: 600,
            border: "none",
            cursor: "pointer"
          }}
        >
          🔥 Current Trends
        </button>
        <button
          onClick={() => { setActiveTab('Events'); setSelectedEvent(null); }}
          style={{
            padding: "10px 25px",
            borderRadius: 20,
            background: activeTab === 'Events' ? "#000" : "#f0f0f0",
            color: activeTab === 'Events' ? "#fff" : "#555",
            fontWeight: 600,
            border: "none",
            cursor: "pointer"
          }}
        >
          Events
        </button>
      </div>

      {/* Gender Filters (only for Trending) */}
      {activeTab === 'Trending' && (
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          {['all', 'men', 'women'].map(gender => (
            <button
              key={gender}
              onClick={() => setGenderFilter(gender)}
              style={{
                padding: "8px 18px",
                borderRadius: 15,
                background: genderFilter === gender ? "#000" : "#f0f0f0",
                color: genderFilter === gender ? "#fff" : "#555",
                fontWeight: 500,
                border: "none",
                cursor: "pointer"
              }}
            >
              {gender === 'all' ? 'All' : gender === 'men' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {activeTab === 'Trending' && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {filteredData.map(item => (
            <div key={item.name} style={{
              width: 220,
              borderRadius: 12,
              overflow: "hidden",
              background: "#fafafa",
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100%", height: 140, objectFit: "cover" }}
                onError={e => (e.target.src = "https://placehold.co/220x140?text=No+Image")}
              />
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{item.name}</div>
                <div style={{ color: "#888", fontSize: 13 }}>{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events Tab Content */}
      {activeTab === 'Events' && (
        <div>
          {!selectedEvent ? (
            loadingEvents ? (
              <p>Loading events...</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                {events.map(event => (
                  <div
                    key={event}
                    style={{
                      width: 220,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#fafafa",
                      marginBottom: 16,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <img
                      src={eventImages[event] || "https://placehold.co/220x140?text=Event"}
                      alt={event}
                      style={{ width: "100%", height: 140, objectFit: "cover" }}
                    />
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{event}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  marginBottom: 10,
                  background: "none",
                  border: "none",
                  color: "#000",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ← Back to Events
              </button>
              {loadingEventItems ? (
                <p>Loading items...</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                  {eventItems.map(item => (
                    <div key={item.id} style={{
                      width: 220,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#fafafa",
                      marginBottom: 16,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100%", height: 140, objectFit: "cover" }}
                        onError={e => (e.target.src = "https://placehold.co/220x140?text=No+Image")}
                      />
                      <div style={{ padding: 12 }}>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{item.name}</div>
                        <div style={{ color: "#888", fontSize: 13 }}>{item.brand}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}