'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Hero from './components/Hero';
import RamenGrid from './components/RamenGrid';
import RamenUpload from './components/RamenUpload';
import StarRating from './components/StarRating';

const MapSection = dynamic(() => import('./components/MapSection'), {
  ssr: false,
});

// 확장된 샘플 데이터
const SAMPLE_SHOPS = [
  { 
    id: 1, name: '멘야하나비 본점', category: '마제소바', rating: 4.8, location: '서울 송파구', 
    lat: 37.5091, lng: 127.1084,
    image_url: 'https://images.unsplash.com/photo-1591814447622-97428f73602d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    reviews: [
      { id: 1, user: '라멘러버', content: '마제소바의 정석입니다. 공밥까지 비벼먹으면 환상적이에요.', rating: 5, date: '2026.03.20' },
      { id: 2, user: '식객', content: '웨이팅이 좀 길지만 기다린 보람이 있는 맛.', rating: 4, date: '2026.03.15' }
    ]
  },
  { 
    id: 2, name: '부탄츄 홍대점', category: '돈코츠라멘', rating: 4.5, location: '서울 마포구', 
    lat: 37.5567, lng: 126.9244,
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    reviews: [
      { id: 3, user: '돈코츠광', content: '국물이 진짜 진해요. 면 종류 선택할 수 있어서 좋아요.', rating: 5, date: '2026.03.25' }
    ]
  },
  { 
    id: 3, name: '오레노라멘 본점', category: '토리빠이탄', rating: 4.9, location: '서울 마포구', 
    lat: 37.5484, lng: 126.9175,
    image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    reviews: [
      { id: 4, user: '미식가', content: '닭 육수가 이렇게 고소할 수 있나요? 인생 라멘입니다.', rating: 5, date: '2026.04.01' }
    ]
  },
  { 
    id: 4, name: '잇텐고', category: '미도리카메', rating: 4.4, location: '서울 마포구', 
    lat: 37.5501, lng: 126.9123,
    image_url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    reviews: [
      { id: 5, user: '바질덕후', content: '바질 라멘 처음인데 너무 맛있어요. 여성분들이 좋아할 맛!', rating: 4, date: '2026.03.28' }
    ]
  },
];

const RANKING_SHOPS = SAMPLE_SHOPS.slice().sort((a, b) => b.rating - a.rating);

export default function Home() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5567, lng: 126.9194 });

  const scrollToMap = () => {
    const mapSection = document.getElementById('map-explorer');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopClick = (shop: any) => {
    setSelectedShop(shop);
    setMapCenter({ lat: shop.lat, lng: shop.lng });
    scrollToMap();
  };

  return (
    <>
      <Header 
        onExploreClick={scrollToMap} 
        onRankingClick={() => document.getElementById('ranking-section')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <main>
        <Hero 
          onExploreClick={scrollToMap} 
          onReviewClick={() => setIsReviewModalOpen(true)}
        />
        
        <RamenGrid 
          title="지금 뜨는 라멘집" 
          icon="🔥" 
          shops={SAMPLE_SHOPS} 
          onShopClick={handleShopClick}
        />
        
        <div id="ranking-section" style={{ backgroundColor: 'var(--surface)', padding: '60px 0' }}>
          <RamenGrid 
            title="인생 라멘 평점 순위" 
            icon="🏆" 
            shops={RANKING_SHOPS} 
            onShopClick={handleShopClick}
          />
        </div>

        <section id="map-explorer" style={{ padding: '80px 0' }}>
          <div className="container">
            <h2 className="section-title">
              <span style={{ fontSize: '28px' }}>📍</span>
              {selectedShop ? `${selectedShop.name} 위치` : '내 주변 라멘 지도'}
            </h2>
            <div style={{ 
              height: '500px', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              border: '4px solid white',
              position: 'relative'
            }}>
              <MapSection isMiniMap={true} center={mapCenter} shops={SAMPLE_SHOPS as any[]} />
            </div>
          </div>
        </section>
      </main>

      {/* Shop Detail Modal */}
      {selectedShop && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            padding: '20px'
          }}
          onClick={() => setSelectedShop(null)}
        >
          <div 
            style={{ 
              backgroundColor: 'white',
              width: '100%',
              maxWidth: '500px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', height: '250px' }}>
              <img src={selectedShop.image_url} alt={selectedShop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => setSelectedShop(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 700 }}
              >✕</button>
            </div>
            <div style={{ padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '4px' }}>{selectedShop.name}</h2>
                  <p style={{ color: 'var(--text-muted)' }}>{selectedShop.category} • {selectedShop.location}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--secondary)', fontSize: '24px', fontWeight: 900 }}>⭐ {selectedShop.rating}</div>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💬</span> 생생 리뷰 ({selectedShop.reviews?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                  {selectedShop.reviews?.map((review: any) => (
                    <div key={review.id} style={{ padding: '16px', backgroundColor: 'var(--surface)', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{review.user}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{review.date}</span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <StarRating rating={review.rating} size={14} readonly={true} />
                      </div>
                      <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#444' }}>{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedShop(null);
                  setIsReviewModalOpen(true);
                }}
                style={{ 
                  width: '100%', 
                  marginTop: '30px', 
                  padding: '16px', 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  fontWeight: 700, 
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >나도 리뷰 남기기</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 4000, padding: '20px'
          }}
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <RamenUpload onReviewSaved={() => setIsReviewModalOpen(false)} />
          </div>
        </div>
      )}

      <footer style={{ padding: '60px 0', backgroundColor: '#212529', color: 'white', marginTop: '60px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px', color: 'var(--primary)' }}>RAMENPEDIA</h3>
              <p style={{ opacity: 0.6, fontSize: '14px', lineHeight: 1.6 }}>대한민국 모든 라멘 덕후들을 위한<br />최고의 라멘 큐레이션 플랫폼</p>
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
