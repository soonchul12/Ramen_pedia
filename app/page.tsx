import { createClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MapSection = dynamic(() => import('./components/MapSection'), {
  ssr: false,
});

// 서버 컴포넌트 (데이터 페칭)
export default async function Home() {
  // DB에서 라멘집 목록 가져오기
  const { data: shops } = await supabase.from('shops').select('*');

  return (
    <MapSection shops={shops || []} />
  );
}