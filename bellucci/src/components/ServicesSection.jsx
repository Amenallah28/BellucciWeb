import React from 'react';

const ServicesSection = () => {
  return (
    <section className="services-section">
      <h2 className="services-title">BELLUCCI SERVICES</h2>
      <div className="services-container">
        <div className="service-card">
          <img 
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600" 
            alt="Stylematching" 
            className="service-image"
          />
          <h3 className="service-title">STYLE MATCHING</h3>
          <p className="service-description">
            Swipe through curated outfits based on your preferences. Bellucci learns your taste and recommends styles tailored just for you.
          </p>
        </div>

        <div className="service-card">
          <img 
            src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600" 
            alt="EVENT-BASED RECOMMENDATIONS" 
            className="service-image"
          />
          <h3 className="service-title">EVENT-BASED RECOMMENDATIONS</h3>
          <p className="service-description">
            Looking for outfits for a date, vacation, or night out? Filter your feed based on the occasion and let Bellucci show you the perfect match.
          </p>
        </div>

        <div className="service-card">
          <img 
            src="https://images.unsplash.com/photo-1483118714900-540cf339fd46?q=80&w=600" 
            alt="DISCOVER LOCAL & GLOBAL TRENDS" 
            className="service-image"
          />
          <h3 className="service-title">DISCOVER LOCAL & GLOBAL TRENDS</h3>
          <p className="service-description">
            Explore fashion pieces from top brands and hidden gems. Whether you're in Tunisia or abroad, Bellucci connects you with the latest styles.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;