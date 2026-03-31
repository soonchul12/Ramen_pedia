'use client';

import RamenCard from './RamenCard';

interface Shop {
  id: number | string;
  name: string;
  category?: string;
  rating?: number;
  image_url?: string;
  location?: string;
}

export default function RamenGrid({ shops, title, icon }: { shops: Shop[], title: string, icon?: string }) {
  return (
    <section style={{ padding: '60px 0' }}>
      <div className="container">
        <h2 className="section-title">
          {icon && <span style={{ fontSize: '28px' }}>{icon}</span>}
          {title}
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          {shops.length > 0 ? (
            shops.map((shop) => (
              <RamenCard key={shop.id} shop={shop} />
            ))
          ) : (
            // Placeholder/Skeleton if needed
            [1, 2, 3, 4].map((i) => (
              <div key={i} style={{ 
                height: '300px', 
                backgroundColor: 'var(--surface)', 
                borderRadius: 'var(--radius-md)',
                animation: 'pulse 1.5s infinite ease-in-out'
              }} />
            ))
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </section>
  );
}
