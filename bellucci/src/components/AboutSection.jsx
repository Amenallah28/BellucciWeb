import React from 'react';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <img 
          src="https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=800" 
          alt="About Bellucci" 
          className="about-image"
        />
        <div className="about-content">
          <h2 className="about-title">The Bellucci Vision</h2>
          <p className="about-description">
            Bellucci is redefining how people discover fashion. Our mission is to make styling fun, personal, and effortless through a swipe-based experience that learns and evolves with every interaction.
          </p>
          <p className="about-description">
            Built for the fashion-forward generation, Bellucci isn't just a shopping app — it's a style companion that evolves with your preferences and introduces you to what you'll love next.
          </p>
          <button className="about-button">DISCOVER OUR STORY</button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;