// LandingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturedSection from './FeaturedSection';
import ServicesSection from './ServicesSection';
import AboutSection from './AboutSection';
import Footer from './Footer';


import '../styles/landing.css';

const LandingPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnterClick = () => {
    navigate('/auth');
  };

  return (
    <div className="landing-page">
      <Header scrollPosition={scrollPosition} />
      <HeroSection scrollPosition={scrollPosition} onEnterClick={handleEnterClick} />
      <FeaturedSection />
      <ServicesSection />
      <AboutSection />
      <Footer />
      
     
    </div>
  );
};

export default LandingPage;