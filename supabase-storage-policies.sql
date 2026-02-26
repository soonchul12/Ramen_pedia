-- ramen_photos 버킷용 Storage RLS 정책
-- Supabase 대시보드 → SQL Editor에서 이 스크립트 전체 실행

-- 1. 누구나(anon 포함) ramen_photos에 파일 업로드 허용
CREATE POLICY "Allow uploads to ramen_photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'ramen_photos');

-- 2. 누구나(anon 포함) ramen_photos 파일 읽기 허용 (공개 URL로 이미지 불러오기 위해 필요)
CREATE POLICY "Allow public read ramen_photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'ramen_photos');
