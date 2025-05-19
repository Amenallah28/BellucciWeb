import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = ({ scrollPosition, onEnterClick }) => {
  return (
    <section className="hero-section">
      <div className="hero-slide">
        <div
          className="hero-background"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d")`,
            transform: `scale(${1 + scrollPosition * 0.0003})`,
          }}
        />

        <div 
          className="hero-logo"
          style={{
            opacity: Math.max(0, 1 - (scrollPosition / 200))
          }}
        >
          BELLUCCI
        </div>

        <div className="hero-content">
          <h2 className="hero-title">Bellucci</h2>
          <div className="hero-buttons">
            <button className="hero-button" onClick={onEnterClick}>
              ENTER <ArrowRight size={16} />
            </button>
            <button className="hero-button" onClick={onEnterClick}>
              FOR HER
            </button>
            <button className="hero-button" onClick={onEnterClick}>
              FOR HIM
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className="scroll-indicator"
        style={{
          opacity: Math.max(0, 1 - (scrollPosition / 150))
        }}
      >
        <div className="scroll-text">Scroll to explore</div>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default HeroSection;