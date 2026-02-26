'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RamenUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // 🚀 DB 저장을 위한 추가 상태값
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      // 상태 초기화
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
      setUploadedUrl(publicUrl); // 저장용 URL 보관

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

  // 🚀 최종적으로 DB에 리뷰를 저장하는 함수
  const handleSaveReview = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        shop_id: 1, // 일단 테스트용으로 아까 넣은 '멘야준(1번)'으로 고정
        rating: rating,
        content: content,
        photo_url: uploadedUrl,
        is_verified: aiResult?.isRamen ?? false,
      });

      if (error) throw error;

      alert('리뷰가 성공적으로 저장되었습니다!');
      // 저장 후 창 초기화
      setFile(null);
      setPreviewUrl(null);
      setAiResult(null);
      setUploadedUrl(null);
      setContent('');
    } catch (err) {
      console.error(err);
      alert('DB 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', zIndex: 100, position: 'absolute', top: '20px', left: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' }}>
      <h3>🍜 라멘 인증 & 리뷰</h3>

      {!aiResult && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
          {previewUrl && (
            <img src={previewUrl} alt="미리보기" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
          )}
          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
            style={{ padding: '10px', width: '100%', backgroundColor: '#ff5a5f', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {isUploading ? 'AI가 분석 중...' : '사진 올리고 검수받기'}
          </button>
        </>
      )}

      {/* AI 검수 완료 후 나타나는 화면 */}
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

          {/* 라멘일 때만 별점과 리뷰 입력창 표시 */}
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
