'use client';

import { useState, useEffect } from 'react';
import Login from './Login';

interface HeaderProps {
  onExploreClick: () => void;
  onRankingClick: () => void;
}

export default function Header({ onExploreClick, onRankingClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <a href="/" style={{ 
          fontSize: '24px', 
          fontWeight: 900, 
          color: scrolled ? 'var(--primary)' : 'white',
          letterSpacing: '-1px',
          textDecoration: 'none'
        }}>
          RAMEN<span style={{ color: scrolled ? 'var(--text-main)' : 'rgba(255,255,255,0.8)' }}>PEDIA</span>
        </a>
        
        <div style={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <input 
            type="text" 
            placeholder="라멘집, 종류, 지역을 검색해보세요"
            style={{
              width: '300px',
              padding: '10px 16px',
              borderRadius: '20px',
              backgroundColor: scrolled ? 'var(--surface)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: scrolled ? 'var(--text-main)' : 'white',
              transition: 'all 0.3s ease'
            }}
          />
        </div>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button 
          onClick={onExploreClick}
          style={{ 
            fontSize: '15px', 
            fontWeight: 600, 
            color: scrolled ? 'var(--text-main)' : 'white',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          라멘 지도
        </button>
        <button 
          onClick={onRankingClick}
          style={{ 
            fontSize: '15px', 
            fontWeight: 600, 
            color: scrolled ? 'var(--text-main)' : 'white',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          랭킹
        </button>
        <Login isScrolled={scrolled} />
      </nav>
    </header>
  );
}
