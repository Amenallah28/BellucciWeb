import React from 'react';
import { ArrowRight } from 'lucide-react';

const FeaturedSection = () => {
  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="featured-row">
          <div className="featured-item">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920" 
              alt="Your Style, Your Swipe" 
              className="featured-image"
            />
          </div>
          <div className="featured-content">
            <h2 className="featured-title">Your Style, Your Swipe</h2>
            <p className="featured-description">
              Bellucci transforms shopping into a fashion experience. Like, dislike, or save pieces with a swipe. Find your next favorite outfit effortlessly.
            </p>
            <button className="featured-button">
              START SWIPING
            </button>
          </div>
        </div>

        <div className="featured-row">
          <div className="featured-content">
            <h2 className="featured-title">STYLE FOR EVERY OCCASION</h2>
            <p className="featured-description">
              Whether it's a casual day out or a formal dinner, Bellucci recommends looks based on events and your unique preferences.
            </p>
            <button className="featured-button">
              EXPLORE LOOKS <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
          <div className="featured-item">
            <img 
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1920" 
              alt="STYLE FOR EVERY OCCASION" 
              className="featured-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;