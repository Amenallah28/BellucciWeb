import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';

const Header = ({ scrollPosition }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);

  useEffect(() => {
    // Gradually increase header opacity as we scroll past 100px
    const newOpacity = scrollPosition > 100 ? Math.min(1, (scrollPosition - 100) / 100) : 0;
    setHeaderOpacity(newOpacity);
  }, [scrollPosition]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getHeaderClass = () => {
    return scrollPosition > 50 ? 'header header-scrolled' : 'header';
  };

  const getLinkClass = () => {
    return scrollPosition > 50 ? 'header-link scrolled' : 'header-link';
  };

  const getContactClass = () => {
    return scrollPosition > 50 ? 'contact-button scrolled' : 'contact-button';
  };

  return (
    <header 
      className={getHeaderClass()}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
        boxShadow: headerOpacity > 0 ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <div className="header-content">
        <div className="left-nav">
          <a href="#contact" className={getContactClass()}>+ Contact Us</a>
          <button className={getLinkClass()} onClick={toggleMenu}>
            <Menu size={20} />
          </button>
        </div>
        
        <div className="center-logo">
          <h1 
            className="brand-name"
            style={{
              opacity: Math.min(1, scrollPosition / 200)
            }}
          >
            BELLUCCI
          </h1>
        </div>
        
        <div className="right-nav">
          <button className={getLinkClass()}>
            <ShoppingBag size={20} />
          </button>
          <button className={getLinkClass()}>
            <User size={20} />
          </button>
          <button className={getLinkClass()}>
            <Search size={20} />
          </button>
          <button className={getLinkClass()} onClick={toggleMenu}>
            <span>MENU</span>
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="menu-overlay">
          <div className="menu-content">
            <button className="close-menu" onClick={toggleMenu}>×</button>
            <ul className="menu-links">
              <li><a href="#women" onClick={toggleMenu}>WOMEN</a></li>
              <li><a href="#men" onClick={toggleMenu}>MEN</a></li>
              <li><a href="#children" onClick={toggleMenu}>CHILDREN</a></li>
              <li><a href="#jewelry" onClick={toggleMenu}>JEWELRY & WATCHES</a></li>
              <li><a href="#beauty" onClick={toggleMenu}>BEAUTY</a></li>
              <li><a href="#decor" onClick={toggleMenu}>DECOR & LIFESTYLE</a></li>
              <li><a href="#gifts" onClick={toggleMenu}>GIFTS</a></li>
              <li><a href="#collections" onClick={toggleMenu}>COLLECTIONS</a></li>
              <li><a href="#about" onClick={toggleMenu}>ABOUT BELLUCCI</a></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;