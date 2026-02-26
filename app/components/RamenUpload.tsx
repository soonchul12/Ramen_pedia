'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RamenUpload() {
  const [user, setUser] = useState<any>(null); // 🚀 로그인한 유저 정보 저장용 상태
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // 🚀 1. 현재 로그인한 유저가 있는지 확인 (화면 켜질 때 1번 실행)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 로그인 상태가 바뀌면 바로바로 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAiResult(null);
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('사진을 선택해주세요!');
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('ramen_photos').upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from('ramen_photos').getPublicUrl(fileName);
      const publicUrl = publicUrlData.publicUrl;
      setUploadedUrl(publicUrl);

      const aiResponse = await fetch('/api/verify-ramen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });

      const data = await aiResponse.json();

      if (!aiResponse.ok) {
        const detail = data.detail ? ` - ${data.detail}` : '';
        throw new Error((data.error || `서버 오류 (${aiResponse.status})`) + detail);
      }

      setAiResult(data);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveReview = async () => {
    if (!user) return alert('로그인이 필요합니다!'); // 🚀 방어 로직

    setIsSaving(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        user_id: user.id, // 🚀 2. DB에 내 고유 ID도 같이 넘겨주기!
        shop_id: 1,       // (테스트용) 멘야준으로 고정
        rating: rating,
        content: content,
        photo_url: uploadedUrl,
        is_verified: aiResult.isRamen,
      });

      if (error) throw error;

      alert('리뷰가 성공적으로 저장되었습니다!');
      setFile(null);
      setPreviewUrl(null);
      setAiResult(null);
      setContent('');
    } catch (err) {
      console.error(err);
      alert('DB 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 🚀 3. 로그인을 안 한 상태면 업로드 창 대신 안내 메시지를 보여줌
  if (!user) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', zIndex: 100, position: 'absolute', top: '20px', left: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' }}>
        <h3>🍜 라멘 인증 & 리뷰</h3>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>우측 상단에서 구글 로그인을 먼저 해주세요!</p>
      </div>
    );
  }

  // 로그인 한 상태면 정상적으로 업로드 폼 보여주기
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', zIndex: 100, position: 'absolute', top: '20px', left: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' }}>
      <h3>🍜 라멘 인증 & 리뷰</h3>

      {!aiResult && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
          {previewUrl && <img src={previewUrl} alt="미리보기" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />}
          <button onClick={handleUpload} disabled={isUploading || !file} style={{ padding: '10px', width: '100%', backgroundColor: '#ff5a5f', color: 'white', border: 'none', borderRadius: '4px' }}>
            {isUploading ? 'AI가 분석 중...' : '사진 올리고 검수받기'}
          </button>
        </>
      )}

      {aiResult && (
        <div style={{ marginTop: '10px' }}>
          {aiResult.isRamen ? (
            <div style={{ backgroundColor: '#e6ffe6', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
              <p style={{ color: 'green', margin: 0 }}>✅ <strong>통과!</strong> ({aiResult.brothType || '라멘'})</p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
              <p style={{ color: 'red', margin: 0 }}>❌ <strong>반려!</strong> 라멘이 아닌 것 같습니다.</p>
              <p style={{ fontSize: '12px' }}>{aiResult.reason}</p>
            </div>
          )}

          {aiResult.isRamen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>
                별점:
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ marginLeft: '10px' }}>
                  <option value={5}>⭐⭐⭐⭐⭐ (5점)</option>
                  <option value={4}>⭐⭐⭐⭐ (4점)</option>
                  <option value={3}>⭐⭐⭐ (3점)</option>
                  <option value={2}>⭐⭐ (2점)</option>
                  <option value={1}>⭐ (1점)</option>
                </select>
              </label>

              <textarea
                placeholder="간단한 리뷰를 남겨주세요!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ width: '100%', padding: '8px', height: '60px', borderRadius: '4px', border: '1px solid #ccc' }}
              />

              <button
                onClick={handleSaveReview}
                disabled={isSaving}
                style={{ padding: '10px', width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                {isSaving ? '저장 중...' : '리뷰 등록하기'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
