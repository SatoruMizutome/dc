import { FC, useRef, useState, useEffect} from 'react';
import { LatLngLiteral, Marker as MarkerRef, Popup as PopupRef} from 'leaflet';
import L from 'leaflet';
import { Marker,Popup, useMap, useMapEvents } from 'react-leaflet';
import { distance } from './utils/distance';

// カスタムイベントの型設定(マーカーのドラッグ終了)
declare global {
  interface DocumentEventMap {
    MarkerDragEnd: CustomEvent<LatLngLiteral[]>;
  }
}

type propType = {
  location: LatLngLiteral;
  setLocation: React.Dispatch<React.SetStateAction<LatLngLiteral>>;
  selectedSite: HeritageSite;
  onAnswer: (score: number) => void;
  onNext: () => void;
};

interface HeritageSite {
    name: string;
    latitude: number;
    longitude: number;
  }


/**
 * 位置表示アイコン
 * ・クリックした位置にアイコン表示する
 *   ・ドラッグ完了時、CustomEventで通知する
 */
const LocationMarker: FC<propType> = ({ location, setLocation, selectedSite, onAnswer, onNext }) => {
  const distanceToSite = distance(location.lat, location.lng, selectedSite.latitude, selectedSite.longitude);
  const maxDistance = 1000; // 最大距離（例：1000km)
  // 距離に応じてポイントを計算
  const score = Math.max(0, 100 - (distanceToSite / maxDistance) * 100);

  const markerRef = useRef<MarkerRef>(null);
  const correctMarkerRef = useRef<MarkerRef>(null);
  const popRef = useRef<PopupRef>(null);
  
  const [showDistance, setShowDistance] = useState(false);
  const [showAnswerButton, setShowAnswerButton] = useState(true);
  const [showHintButton, setShowHintButton] = useState(true);
  const [showNextButton, setShowNextButton] = useState(false);

  const map = useMap();

  useMapEvents({
    click: (e) => {
      setLocation(e.latlng);
    },
  });

  const handleAnswer = () => {
    map.flyTo([selectedSite.latitude, selectedSite.longitude], 8, {
      animate: true,
      //duration: 1.5, // アニメーションの時間（秒）
    });

    alert(`得点: ${score.toFixed(2)}`);
    onAnswer(score);
    setShowDistance(false);

    // ボタンを非表示にする
    setShowAnswerButton(false);
    setShowHintButton(false);

    setShowNextButton(true);

  };

  const handleNext = () => {
    // ページのトップにスクロール
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // スムーススクロールを有効にする場合
    });
    // ボタンを再表示する
    setShowAnswerButton(true);
    setShowHintButton(true);
    setShowNextButton(false);

    onNext();
  };

  const toggleDistance = () => {
    setShowDistance(true);
  };

  

  /**
   * <Marker> クリック位置に表示するアイコン
   * <Popup> アイコン上に表示する吹き出し(googleマップで開く)
   * <Polyline> 直線(Markerをドラッグ＆ドロップして直線を引く)
   */

  return !location ? null : (
    <>
      <Marker
        draggable={true}
        position={location}
        ref={markerRef}
      >
        <Popup>
        <div>
          {showDistance && <p>距離: {distanceToSite.toFixed(2)} km</p>}
          {showAnswerButton && (
            <button className="answer-button" onClick={handleAnswer}>解答</button>
          )}
          {showHintButton && (
            <button className="hint-button" onClick={toggleDistance}>ヒント</button>
          )}
        </div>
      </Popup>
      </Marker>
      {/* 正解位置の赤いマーカー */}
      {showNextButton && (
        <Marker
          position={{ lat: selectedSite.latitude, lng: selectedSite.longitude }}
          ref={correctMarkerRef}
          icon={new L.Icon({ iconUrl: '/red-marker-icon.png', iconSize: [35, 35] })} // 赤いマーカーのアイコンを指定
        >
          <Popup>
          <div>
              <p>{selectedSite.name}</p>
              <p>正解座標: {selectedSite.latitude}, {selectedSite.longitude}</p>
              <button className="next-quiz-button" onClick={handleNext}>次の問題</button>
          </div>
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default LocationMarker;