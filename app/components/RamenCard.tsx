'use client';

interface Shop {
  id: number | string;
  name: string;
  category?: string;
  rating?: number;
  image_url?: string;
  location?: string;
}

export default function RamenCard({ 
  shop, 
  onClick 
}: { 
  shop: Shop; 
  onClick?: () => void; 
}) {
  // Mock image if not available
  const imageUrl = shop.image_url || `https://images.unsplash.com/photo-1557872245-741744979584?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`;
  const rating = shop.rating || (4 + Math.random()).toFixed(1);

  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        border: '1px solid var(--border)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '66%', // 3:2 Aspect Ratio
        backgroundColor: '#eee',
        overflow: 'hidden'
      }}>
        <img 
          src={imageUrl} 
          alt={shop.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ color: 'var(--secondary)' }}>⭐</span>
          {rating}
        </div>
      </div>
      
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.5px' }}>
          {shop.name}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {shop.category || '라멘전문점'} • {shop.location || '서울 마포구'}
        </p>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          {['인생맛집', '국물진함', '친절함'].slice(0, 2).map(tag => (
            <span key={tag} style={{
              fontSize: '11px',
              padding: '2px 8px',
              backgroundColor: 'var(--surface)',
              borderRadius: '4px',
              color: 'var(--text-muted)',
              fontWeight: 500
            }}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
