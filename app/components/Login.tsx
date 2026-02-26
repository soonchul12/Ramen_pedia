'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
  const [user, setUser] = useState<any>(null);

  // 현재 로그인한 유저 정보 가져오기
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 로그인 상태가 변할 때마다 업데이트
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 구글 로그인 실행 함수
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`, // 로그인 후 돌아올 주소
      },
    });
  };

  // 로그아웃 실행 함수
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100, backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.user_metadata.avatar_url} alt="프로필" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{user.user_metadata.full_name}님</span>
          <button onClick={signOut} style={{ padding: '5px 10px', backgroundColor: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
            로그아웃
          </button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} style={{ padding: '8px 15px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Google로 시작하기
        </button>
      )}
    </div>
  );
}