import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import ClothingCard from "./ClothingCard";
import "../styles/swipeEffects.css";

export default function ClothingSwiper({
  items,
  onSwipe,
  savedIds,
  onSaveToggle,
  onCardClick,
  currentIndex = 0,
}) {
  // Use the currentIndex prop as the source of truth
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isBuying, setIsBuying] = useState(false);
  const [swipePosition, setSwipePosition] = useState({ x: 0, y: 0 });

  // Keep internalIndex in sync with prop
  useEffect(() => {
    setInternalIndex(currentIndex);
  }, [currentIndex, items.length]);

  const handleSwipe = (dir) => {
    setSwipeDirection(dir);
    setIsBuying(dir === "up");

    setTimeout(() => {
      const currentItem = items[internalIndex];
      if (onSwipe) onSwipe(dir, currentItem);
      setSwipeDirection(null);
      setIsBuying(false);
      setSwipePosition({ x: 0, y: 0 });
      setInternalIndex((prev) => prev + 1);
    }, 500);
  };

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setSwipePosition({ x: e.deltaX, y: e.deltaY });
    },
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    onSwipedUp: () => handleSwipe("up"),
    onTap: (e) => {
      if (!e.event.target.closest('.save-button')) {
        const currentItem = items[internalIndex];
        onCardClick && onCardClick(currentItem);
      }
    },
    trackMouse: true,
    delta: 15,
    preventDefaultTouchmoveEvent: true,
  });

  if (internalIndex >= items.length) {
    return <div className="end-message">No more items to show!</div>;
  }

  const currentItem = items[internalIndex];
  const cardClasses = [
    "swipe-card",
    swipeDirection ? `swipe-${swipeDirection}` : "",
    isBuying ? "buy-pulse" : ""
  ].join(" ");

  // Calculate swipe feedback opacity
  const likeOpacity = Math.max(0, Math.min(1, swipePosition.x / 100));
  const dislikeOpacity = Math.max(0, Math.min(1, -swipePosition.x / 100));
  const buyOpacity = Math.max(0, Math.min(1, -swipePosition.y / 50));

  return (
    <div className="swipe-container">
      {/* Dynamic swipe feedback */}
      <div className="swipe-feedback">
        <div 
          className="feedback-like" 
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </div>
        <div 
          className="feedback-dislike" 
          style={{ opacity: dislikeOpacity }}
        >
          DISLIKE
        </div>
        <div 
          className="feedback-buy" 
          style={{ opacity: buyOpacity }}
        >
          BUY
        </div>
      </div>

      {/* Active card */}
      <div 
        {...handlers} 
        className={cardClasses}
        style={{
          transform: swipeDirection ? undefined : 
            `translate(${swipePosition.x}px, ${swipePosition.y}px) rotate(${swipePosition.x / 20}deg)`
        }}
      >
        <ClothingCard
          item={currentItem}
          isSaved={savedIds.includes(currentItem.id)}
          onSaveToggle={onSaveToggle}
          onClick={() => onCardClick && onCardClick(currentItem)}
        />
        {isBuying && <div className="buy-confirmation">Added to Cart!</div>}
      </div>
    </div>
  );
}
