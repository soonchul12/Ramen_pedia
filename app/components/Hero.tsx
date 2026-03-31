'use client';

export default function Hero() {
  return (
    <section style={{
      height: '600px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      color: 'white',
      backgroundColor: '#212529'
    }}>
      {/* Background Image Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 1
      }} />

      <div className="container animate-fade-in" style={{ 
        position: 'relative', 
        zIndex: 2, 
        textAlign: 'center',
        maxWidth: '800px'
      }}>
        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: 900, 
          marginBottom: '20px',
          letterSpacing: '-2px',
          lineHeight: 1.1
        }}>
          당신의 인생 라멘을<br />
          찾아보세요
        </h1>
        <p style={{ 
          fontSize: '20px', 
          marginBottom: '40px', 
          opacity: 0.9,
          fontWeight: 400
        }}>
          전국의 라멘 맛집 정보와 생생한 리뷰를 한눈에.<br />
          AI 기반의 라멘 인증 시스템으로 신뢰할 수 있는 정보를 확인하세요.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button style={{
            padding: '16px 32px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: 700,
            boxShadow: '0 10px 20px rgba(255, 75, 43, 0.3)',
            transition: 'transform 0.2s'
          }}>
            맛집 탐색하기
          </button>
          <button style={{
            padding: '16px 32px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: 700,
            transition: 'all 0.2s'
          }}>
            리뷰 작성하기
          </button>
        </div>
      </div>

      {/* Floating stats or labels could go here */}
    </section>
  );
}
