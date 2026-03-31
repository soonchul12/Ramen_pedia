import type { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';

const naverMapClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? '';

export const metadata = {
  title: 'Ramen Pedia | 인생 라멘을 찾아서',
  description: '전국 라멘 맛집 지도 및 리뷰 플랫폼, 라멘피디아',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {naverMapClientId && (
          <Script
            src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapClientId}`}
            strategy="beforeInteractive"
            referrerPolicy="no-referrer"
          />
        )}
        {children}
      </body>
    </html>
  );
}

