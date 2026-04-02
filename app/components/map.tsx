'use client';

import { Container, Marker, NaverMap, useNavermaps } from 'react-naver-maps';

export default function Map({ shops, center }: { shops: any[], center?: { lat: number, lng: number } }) {
  const navermaps = useNavermaps();
  const MapDiv = Container;

  return (
    <MapDiv
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <NaverMap
        defaultCenter={new navermaps.LatLng(37.5567, 126.9194)}
        center={center ? new navermaps.LatLng(center.lat, center.lng) : undefined}
        defaultZoom={15}
      >
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={new navermaps.LatLng(shop.lat, shop.lng)}
            title={shop.name}
            icon={{
              content: `
                <div style="
                  background-color: ${shop.isReviewed ? '#FFB800' : '#FF4B2B'};
                  color: white;
                  padding: 10px;
                  border-radius: 20px;
                  border: 3px solid white;
                  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  transform: translateY(-50%);
                  transition: all 0.2s ease;
                ">
                  <span style="font-size: 16px;">${shop.isReviewed ? '⭐' : '🍜'}</span>
                  <span style="font-weight: 700; font-size: 13px; white-space: nowrap; padding-right: 4px;">${shop.name}</span>
                </div>
              `,
              anchor: new navermaps.Point(20, 20),
            }}
            onClick={() =>
              alert(
                `${shop.name}\n${shop.category || ''}${
                  shop.isReviewed ? '\n(이미 리뷰를 남긴 곳입니다!)' : ''
                }`
              )
            }
          />
        ))}
      </NaverMap>
    </MapDiv>
  );
}