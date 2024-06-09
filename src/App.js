import styles from "./App.module.css";
import HomeIcon from "./icons/home.svg";
import SearchIcon from "./icons/search.svg";
import Home from "./components/Home/Home";
import Search from "./components/Search/Search";
import ReactYoutube from "./components/ReactYoutube/ReactYoutube";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

function App() {
  const [videoId, setVideoId] = useState(null);
  const [player, setPlayer] = useState(null);

  const handlePlayerReady = (playerInstance) => {
    setPlayer(playerInstance);
  };

  const playMusic = (id) => {
    console.log(id);
    setVideoId(id);
  };

  const playVideo = () => {
    if (player) {
      player.playVideo();
    }
  };

  const pauseVideo = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  return (
    <Router>
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.leftSide}>
            <div className={styles.upperSection}>
              <div className={styles.upperContent}>
                <Link style={{ textDecoration: "none" }} to={"/home"}>
                  <button className={styles.leftButton}>
                    <img
                      className={styles.leftIcon}
                      src={HomeIcon}
                      alt="Home"
                    ></img>
                    <p className={styles.leftTitle}>Home</p>
                  </button>
                </Link>
                <Link style={{ textDecoration: "none" }} to={"/search"}>
                  <button className={styles.leftButton}>
                    <img
                      className={styles.leftIcon}
                      src={SearchIcon}
                      alt="Search"
                    ></img>
                    <p className={styles.leftTitle}>Search</p>
                  </button>
                </Link>
              </div>
            </div>
            <div className={styles.bottomSection}>
              <div className={styles.bottomContent}>
                <p className={styles.playlistText}>Playlists</p>
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <Routes>
              <Route index path="/home" element={<Home />} />
              <Route
                path="/search"
                element={<Search data={{ playMusic: (id) => playMusic(id) }} />}
              />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.infoDiv}>
            <button onClick={playVideo}>Play</button>
            <button onClick={pauseVideo}>Pause</button>
          </div>
          <div className={styles.controllerDiv}></div>
          <div className={styles.buttonsDiv}></div>
          <ReactYoutube
            className={styles.player}
            videoId={videoId}
            onPlayerReady={handlePlayerReady}
          ></ReactYoutube>
        </div>
      </div>
    </Router>
  );
}

export default App;
