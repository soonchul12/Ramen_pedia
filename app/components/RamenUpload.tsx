'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import StarRating from './StarRating';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RamenUpload({ onReviewSaved }: { onReviewSaved: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

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
      if (!aiResponse.ok) throw new Error(data.error || 'AI 분석 중 오류 발생');

      setAiResult(data);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveReview = async () => {
    if (!user) return alert('로그인이 필요합니다!');

    setIsSaving(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        shop_id: 1, // Mock
        rating: rating,
        content: content,
        photo_url: uploadedUrl,
        is_verified: aiResult?.isRamen,
      });

      if (error) throw error;

      alert('리뷰가 성공적으로 저장되었습니다!');
      onReviewSaved();
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

  if (!user) {
    return (
      <div style={{ 
        padding: '30px', 
        backgroundColor: 'white', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow)', 
        width: '360px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '12px' }}>🍜 라멘 인증하기</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
          리뷰를 남기려면 먼저 로그인이 필요합니다.
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px', 
      backgroundColor: 'white', 
      borderRadius: 'var(--radius-lg)', 
      boxShadow: 'var(--shadow)', 
      width: '360px',
      border: '1px solid var(--border)'
    }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', letterSpacing: '-0.5px' }}>
        🍜 라멘 인증 & 리뷰
      </h3>

      {!aiResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div 
            onClick={() => document.getElementById('file-upload')?.click()}
            style={{
              width: '100%',
              height: '200px',
              backgroundColor: 'var(--surface)',
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <span style={{ fontSize: '32px', marginBottom: '8px' }}>📸</span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>사진을 업로드해주세요</span>
              </>
            )}
            <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>
          
          <button 
            onClick={handleUpload} 
            disabled={isUploading || !file} 
            style={{ 
              padding: '14px', 
              width: '100%', 
              backgroundColor: isUploading ? 'var(--text-muted)' : 'var(--primary)', 
              color: 'white', 
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '15px',
              transition: 'all 0.2s'
            }}
          >
            {isUploading ? 'AI 분석 중...' : '라멘 인증받기'}
          </button>
        </div>
      )}

      {aiResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s' }}>
          {aiResult.isRamen ? (
            <div style={{ 
              backgroundColor: '#F0FFF4', 
              padding: '12px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid #C6F6D5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#38A169' }}>✅</span>
              <p style={{ color: '#2F855A', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                훌륭한 <strong>{aiResult.brothType || '라멘'}</strong> 인증 완료!
              </p>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: '#FFF5F5', 
              padding: '12px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid #FED7D7' 
            }}>
              <p style={{ color: '#C53030', fontSize: '14px', fontWeight: 600, margin: 0 }}>❌ 라멘이 아닌 것 같습니다.</p>
              <p style={{ fontSize: '12px', color: '#9B2C2C', marginTop: '4px' }}>{aiResult.reason}</p>
            </div>
          )}

          {aiResult.isRamen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>평가하기</label>
                <StarRating rating={rating} onRatingChange={setRating} size={32} />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>리뷰 남기기</label>
                <textarea
                  placeholder="맛은 어떠셨나요? 육수의 깊이나 면의 식감을 공유해주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    height: '100px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <button
                onClick={handleSaveReview}
                disabled={isSaving}
                style={{ 
                  padding: '14px', 
                  width: '100%', 
                  backgroundColor: '#0070F3', 
                  color: 'white', 
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '15px'
                }}
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
