import { FC, useState } from 'react';
import { LatLngLiteral } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';

import './utils/initLeaflet'; // アイコン表示位置の調整
import LocationDispArea from './LocationDispArea';
import LocationMarker from './LocationMarker';
import heritageSitesData from './heritageSitesData.json'

import 'leaflet/dist/leaflet.css';
import './App.css';


const App: FC = () => {
  // クリックされた位置(初期位置は新宿駅)
  const [center, setCenter] = useState<LatLngLiteral>({
    lat: 35.6905,
    lng: 139.6995,
  });
  const [location, setLocation] = useState<LatLngLiteral>({
    lat: 35.6905,
    lng: 139.6995,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedSite, setSelectedSite] = useState(() => getRandomSite());
  
  function getRandomSite() {
    return heritageSitesData[Math.floor(Math.random() * heritageSitesData.length)];
  }

  const handleStartGame = () => {
    setGameStarted(true);
    resetQuiz();
  };


  const handleNextQuiz = () => {
    setSelectedSite(getRandomSite());
    setQuizCount((prevCount) => prevCount + 1);
  };

  const handleQuizAnswer = (score: number) => {
    setTotalScore((prevScore) => prevScore + score);
    if (quizCount === 9) {
      // 最後のクイズの場合、結果を表示
      alert(`合計スコア: ${(totalScore).toFixed(2)}`);
      handleNextQuiz();
      setGameStarted(false);
    } 
  };

  const resetQuiz = () => {
    setQuizCount(0);
    setTotalScore(0);
    setSelectedSite(getRandomSite());
    setCenter({
      lat: 35.6905,
      lng: 139.6995,
    });
    setLocation({
      lat: 35.6905,
      lng: 139.6995,
    });
  };

  /**
   * <MapContainer> ReactLeafletの地図を表示するコンテナ
   *   <TileLayer> osmを表示するレイヤー
   *   <LocationDispArea> マップの右上に表示する情報表示領域(緯度、経度)
   *   <LocationMarker> クリック位置を表すアイコン
   * <CrossSectionDialog> 標高の断面図を表示するためのダイアログ(内部でグラフを表示)
   */
  return (
    <div className="App">
      <header style={{ textAlign: 'center' }}>
        {!gameStarted && (
          <h1 className="title">GeoQuizGame</h1>
        )}
        {!gameStarted ? (
          <button className="start-button" onClick={handleStartGame}>ゲームスタート</button>
        ) : (     
          <>
            <img src={`/img/${selectedSite.url}`} alt={`Quiz: ${selectedSite.name}`}></img>
            <div className="attribution-text">&copy; <a href="https://worldheritagesite.xyz/ranking/">WorldHeritageSite</a> contributors</div>
            <h2 className="quiz-header">{`クイズ第${quizCount + 1}問: ${selectedSite.name}を探せ！`}</h2>
          </>
        )}
      </header>
      {gameStarted && quizCount < 10 && (
          <MapContainer center={center} zoom={3}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
            <LocationDispArea location={location} />
            <LocationMarker
              location={location}
              setLocation={setLocation}
              selectedSite={selectedSite} // selectedSiteがnullの場合に備えてダミーを渡す
              onAnswer={handleQuizAnswer}
              onNext={handleNextQuiz}
            />
          </MapContainer>
      )}
    </div>
  );
};

export default App;