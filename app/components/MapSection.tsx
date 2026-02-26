'use client';

import { NavermapsProvider } from 'react-naver-maps';
import Map from './map';
import RamenUpload from './RamenUpload';
import Login from './Login';

interface Shop {
  id: number | string;
  lat: number;
  lng: number;
  name: string;
  category?: string;
}

const ncpKeyId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? '';

export default function MapSection({ shops }: { shops: Shop[] }) {
  return (
    <NavermapsProvider ncpKeyId={ncpKeyId}>
      <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        {/* 우측 상단 로그인 */}
        <Login />
        {/* 좌측 상단 업로드 창 */}
        <RamenUpload />
        <Map shops={shops} />
      </main>
    </NavermapsProvider>
  );
}

