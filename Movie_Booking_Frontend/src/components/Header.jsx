import React from 'react';
import { Film } from 'lucide-react';

export default function Header() {
  return (
    <header className="header navbar-light bg-white shadow-sm mb-2 p-0" style={{background: 'light gray'}}>
      <nav className="navbar">
        <div className="container-fluid" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div className="navbar-brand">
            <Film className="brand-icon" style={{marginTop:'-0.8rem'}} />
            <span className="brand-text" style={{fontSize: '3rem',fontWeight:800}}>CineBook</span>
          </div>

          <div className="navbar-nav">
            <h1 className="hero-title">Book Your Perfect Movie Experience</h1>
            <p className="hero-subtitle">Choose from the latest blockbusters and enjoy premium seating</p>
          </div>
        </div>
      </nav>
    </header>
  );
}