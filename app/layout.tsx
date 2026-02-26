import type { ReactNode } from 'react';
import Script from 'next/script';

const naverMapClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? '';

export const metadata = {
  title: 'Ramen Pedia',
  description: '라멘 맛집 지도 서비스',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0 }}>
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

