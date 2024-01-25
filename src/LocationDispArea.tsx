import { FC} from 'react';
import { LatLngLiteral } from 'leaflet';

import Control from 'react-leaflet-custom-control';

/**
 * 位置情報表示エリア
 * ・クリックした位置の「緯度」「経度」を表示するエリア
 * ・propsで位置を受け取り表示する
 * ・react-leaflet-custom-controlでラップすることで、マップ上にオーバーレイ表示する
 */
const LocationIndicator: FC<{ location: LatLngLiteral }> = ({ location }) => {
  const f = (num: number, fixed = 6) =>
    ('             ' + num.toFixed(fixed)).slice(-6 - fixed);
  const formatCoords = (lat: number, lng: number) =>
    `緯度:${f(lat)}\n経度:${f(lng)}`;

  // 地図領域右上(topright)に、緯度と経度を表示する
  return (
    <Control position="topright">
      <div style={{ backgroundColor: 'Lavender' }}>
        <pre className="coords">{formatCoords(location.lat, location.lng)}</pre>
      </div>
    </Control>
  );
};

export default LocationIndicator;
