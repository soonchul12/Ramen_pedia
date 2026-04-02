'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoginProps {
  isScrolled?: boolean;
}

export default function Login({ isScrolled = true }: LoginProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase 설정(URL/KEY)이 누락되었습니다. .env.local 파일을 확인해주세요.');
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error('Login error:', err);
      alert(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={user.user_metadata.avatar_url} 
            alt="프로필" 
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${isScrolled ? 'var(--border)' : 'rgba(255,255,255,0.3)'}` }} 
          />
          <span style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: isScrolled ? 'var(--text-main)' : 'white' 
          }}>
            {user.user_metadata.full_name}
          </span>
          <button 
            onClick={signOut} 
            style={{ 
              padding: '6px 12px', 
              backgroundColor: isScrolled ? 'var(--surface)' : 'rgba(255,255,255,0.2)', 
              color: isScrolled ? 'var(--text-muted)' : 'white',
              border: 'none', 
              borderRadius: '20px', 
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <button 
          onClick={signInWithGoogle} 
          style={{ 
            padding: '8px 20px', 
            backgroundColor: isScrolled ? 'var(--primary)' : 'white', 
            color: isScrolled ? 'white' : 'var(--primary)', 
            border: 'none', 
            borderRadius: '20px', 
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.2s'
          }}
        >
          시작하기
        </button>
      )}
    </div>
  );
}
