import dynamic from 'next/dynamic';
import Header from './components/Header';
import Hero from './components/Hero';
import RamenGrid from './components/RamenGrid';

const MapSection = dynamic(() => import('./components/MapSection'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        
        <RamenGrid 
          title="지금 뜨는 라멘집" 
          icon="🔥" 
          shops={[]} 
        />
        
        <div style={{ backgroundColor: 'var(--surface)', padding: '60px 0' }}>
          <RamenGrid 
            title="인생 라멘 평점 순위" 
            icon="🏆" 
            shops={[]} 
          />
        </div>

        <section id="map-explorer" style={{ padding: '80px 0' }}>
          <div className="container">
            <h2 className="section-title">
              <span style={{ fontSize: '28px' }}>📍</span>
              내 주변 라멘 지도
            </h2>
            <div style={{ 
              height: '500px', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              border: '4px solid white',
              position: 'relative'
            }}>
              <MapSection isMiniMap={true} />
            </div>
          </div>
        </section>
      </main>

      <footer style={{
        padding: '60px 0',
        backgroundColor: '#212529',
        color: 'white',
        marginTop: '60px'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px', color: 'var(--primary)' }}>RAMENPEDIA</h3>
              <p style={{ opacity: 0.6, fontSize: '14px', lineHeight: 1.6 }}>
                대한민국 모든 라멘 덕후들을 위한<br />
                최고의 라멘 큐레이션 플랫폼
              </p>
            </div>
            <div style={{ display: 'flex', gap: '60px' }}>
              <div>
                <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>서비스</h4>
                <ul style={{ opacity: 0.6, fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><a href="#">라멘 탐색</a></li>
                  <li><a href="#">지도 보기</a></li>
                  <li><a href="#">커뮤니티</a></li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>고객센터</h4>
                <ul style={{ opacity: 0.6, fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><a href="#">공지사항</a></li>
                  <li><a href="#">문의하기</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '60px', paddingTop: '20px', fontSize: '12px', opacity: 0.4 }}>
            © 2026 Ramen Pedia. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
