'use client';

import { NavermapsProvider } from 'react-naver-maps';
import Map from './map';
import RamenUpload from './RamenUpload';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Shop {
  id: number | string;
  lat: number;
  lng: number;
  name: string;
  category?: string;
  isReviewed?: boolean;
}

const ncpKeyId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? '';

export default function MapSection({
  shops: initialShops = [],
  isMiniMap = false,
  center,
}: {
  shops?: Shop[];
  isMiniMap?: boolean;
  center?: { lat: number, lng: number };
}) {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [displayShops, setDisplayShops] = useState<Shop[]>(initialShops);
  const [showUpload, setShowUpload] = useState(false);

  const fetchShops = async () => {
    const { data, error } = await supabase.from('shops').select('*');
    if (error) return;
    setShops((data as Shop[]) ?? []);
  };

  const fetchUserReviews = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setDisplayShops(shops.map(s => ({ ...s, isReviewed: false })));
      return;
    }

    const { data: reviews } = await supabase
      .from('reviews')
      .select('shop_id')
      .eq('user_id', session.user.id);

    const reviewedShopIds = new Set(reviews?.map(r => r.shop_id));
    
    const augmentedShops = shops.map(shop => ({
      ...shop,
      isReviewed: reviewedShopIds.has(shop.id)
    }));

    setDisplayShops(augmentedShops);
  };

  useEffect(() => {
    // If no shops passed (SSR off), fetch on client
    if (shops.length === 0) {
      fetchShops();
      return;
    }
    fetchUserReviews();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setDisplayShops(shops.map(s => ({ ...s, isReviewed: false })));
      } else {
        fetchUserReviews();
      }
    });

    return () => subscription.unsubscribe();
  }, [shops]);

  return (
    <NavermapsProvider ncpKeyId={ncpKeyId}>
      <div style={{ 
        width: '100%', 
        height: isMiniMap ? '100%' : '100vh', 
        position: 'relative',
        minHeight: isMiniMap ? '500px' : 'none'
      }}>
        {/* 업로드 버튼 (미니맵일 때도 필요할 수 있음) */}
        {!isMiniMap && (
          <button 
            onClick={() => setShowUpload(!showUpload)}
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              zIndex: 100,
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '30px',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🍜</span> {showUpload ? '닫기' : '라멘 인증하기'}
          </button>
        )}

        {showUpload && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 101,
            animation: 'fadeIn 0.3s ease'
          }}>
            <RamenUpload onReviewSaved={() => {
              fetchUserReviews();
              setShowUpload(false);
            }} />
          </div>
        )}

        <Map shops={displayShops} center={center} />
      </div>
    </NavermapsProvider>
  );
}
