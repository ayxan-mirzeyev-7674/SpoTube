import styles from "./App.module.css";
import HomeIcon from "./icons/home.svg";
import SearchIcon from "./icons/search.svg";
import PlayIcon from "./icons/Media/play.svg";
import PauseIcon from "./icons/Media/pause.svg";
import NextIcon from "./icons/Media/next.svg";
import RepeatIcon from "./icons/Media/repeat.svg";
import RepeatOneIcon from "./icons/Media/repeatOne.svg";
import Home from "./components/Home/Home";
import Search from "./components/Search/Search";
import ReactYoutube from "./components/ReactYoutube/ReactYoutube";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext, useEffect, useReducer, useRef, useState } from "react";

import Store from "./context";
import reducer from "./reducer";

import { usePersistedContext, usePersistedReducer } from "./usePersist";

function App() {
  const [videoId, setVideoId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [playerState, setPlayerState] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const [repeatOne, setRepeatOne] = useState(false);

  const progressRef = useRef(null);

  const globalStore = usePersistedContext(useContext(Store), "state");
  const [state, dispatch] = usePersistedReducer(
    useReducer(reducer, globalStore),
    "state"
  );

  const handlePlayerReady = (playerInstance) => {
    setPlayer(playerInstance);
  };

  const handleStageChange = () => {
    setPlayerState(player.getPlayerState());
    console.log("Handle");
  };

  const handleProgressChange = () => {
    console.log(progressRef.current.value);
    player.seekTo(progressRef.current.value);
  };

  const playMusic = (item) => {
    console.log(item);
    setVideoId(item.id.videoId);
    setCurrentMusic(item);
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

  const formatSec = (elapsed_sec) => {
    const min = Math.floor(elapsed_sec / 60);
    const seconds = Math.floor(elapsed_sec - min * 60);

    return min.toString() + ":" + seconds.toString().padStart(2, "0");
  };

  useEffect(() => {
    console.log("USE");
    const interval = setInterval(async () => {
      const elapsed_sec = await player?.getCurrentTime(); // this is a promise. dont forget to await

      setElapsed(formatSec(elapsed_sec));
      videoId && (progressRef.current.value = elapsed_sec);
    }, 100); // 100 ms refresh. increase it if you don't require millisecond precision

    return () => {
      clearInterval(interval);
    };
  }, [player]);

  const toggleVideo = () => {
    console.log(player.getPlayerState());
    console.log(player?.getDuration());
    if (player.getPlayerState() == 1 || player.getPlayerState() == 0) {
      pauseVideo();
    } else if (player.getPlayerState() == 2) {
      playVideo();
    }
  };

  document.onkeydown = (event) => {
    if (event.keyCode !== 32 || event.target.matches("input")) return;

    toggleVideo();
  };

  return (
    <Store.Provider value={{ state, dispatch }}>
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
                  element={
                    <Search data={{ playMusic: (item) => playMusic(item) }} />
                  }
                />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.infoDiv}>
              <div className={styles.currentImageDiv}>
                <img
                  src={currentMusic?.snippet.thumbnails.default.url}
                  className={styles.currentImage}
                ></img>
              </div>
              <div className={styles.currentTextDiv}>
                <span className={styles.currentTitle}>
                  {currentMusic?.snippet.title}
                </span>
                <span className={styles.currentDesc}>
                  {currentMusic?.snippet.channelTitle}
                </span>
              </div>
            </div>
            <div className={styles.controllerDiv}>
              <div className={styles.mediaButtons}>
                <div className={styles.leftMedia}>
                  <button className={styles.nextButton}>
                    <img
                      style={{ transform: "scaleX(-1)" }}
                      className={styles.nextImg}
                      src={NextIcon}
                      alt="Previous"
                    ></img>
                  </button>
                </div>
                <button className={styles.toggleButton} onClick={toggleVideo}>
                  <img
                    className={styles.toggleImg}
                    src={playerState === 1 ? PauseIcon : PlayIcon}
                    alt="Toggle"
                  ></img>
                </button>
                <div className={styles.rightMedia}>
                  <button className={styles.nextButton}>
                    <img
                      className={styles.nextImg}
                      src={NextIcon}
                      alt="Next"
                    ></img>
                  </button>
                  <button
                    onClick={() => {
                      setRepeatOne((pre) => !pre);
                    }}
                    className={styles.nextButton}
                  >
                    <img
                      className={styles.repeatImg}
                      src={repeatOne ? RepeatOneIcon : RepeatIcon}
                      alt="Repeat"
                    ></img>
                  </button>
                </div>
              </div>
              <div className={styles.progressBarDiv}>
                <span style={{ color: "white" }}>{elapsed}</span>
                <div className={styles.progressDiv}>
                  <input
                    type="range"
                    min={0}
                    max={player?.getDuration()}
                    step={1}
                    defaultValue={0}
                    ref={progressRef}
                    onChange={handleProgressChange}
                  ></input>
                  {progressRef.current && (
                    <div
                      style={{
                        width:
                          "calc(" +
                          (
                            (progressRef.current.value /
                              player?.getDuration()) *
                            100
                          ).toString() +
                          "% )",
                      }}
                      className={styles.progress}
                    ></div>
                  )}
                </div>
                <span style={{ color: "white", textAlign: "right" }}>
                  {formatSec(player?.getDuration())}
                </span>
              </div>
            </div>
            <div className={styles.buttonsDiv}>
              <ReactYoutube
                className={styles.player}
                videoId={videoId}
                onPlayerReady={handlePlayerReady}
                onStateChange={handleStageChange}
              ></ReactYoutube>
            </div>
          </div>
        </div>
      </Router>
    </Store.Provider>
  );
}

export default App;
