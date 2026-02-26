'use client';

import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

export default function Map({ shops }: { shops: any[] }) {
  const navermaps = useNavermaps();

  return (
    <MapDiv
      style={{
        width: '100%',
        height: '100vh', // 전체 화면
      }}
    >
      <NaverMap
        defaultCenter={new navermaps.LatLng(37.5567, 126.9194)} // 초기 중심: 멘야준 근처
        defaultZoom={15}
      >
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={new navermaps.LatLng(shop.lat, shop.lng)}
            title={shop.name}
            onClick={() => alert(`${shop.name}\n${shop.category}`)} // 클릭 시 알림
          />
        ))}
      </NaverMap>
    </MapDiv>
  );
}