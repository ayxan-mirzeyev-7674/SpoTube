import styles from "./App.module.css";
import HomeIcon from "./icons/home.svg";
import SearchIcon from "./icons/search.svg";
import PlayIcon from "./icons/Media/play.svg";
import PauseIcon from "./icons/Media/pause.svg";
import NextIcon from "./icons/Media/next.svg";
import RepeatIcon from "./icons/Media/repeat.svg";
import RepeatOneIcon from "./icons/Media/repeatOne.svg";
import SoundOffIcon from "./icons/Media/sound-off.svg";
import Sound1Icon from "./icons/Media/sound-volume-1.svg";
import Sound2Icon from "./icons/Media/sound-volume-2.svg";
import QueueIcon from "./icons/Media/queue.svg";
import YoutubeIcon from "./icons/Media/youtube.svg";
import CloseIcon from "@mui/icons-material/Close";
import TickIcon from "./icons/Media/tick-circle.svg";
import AddIcon from "./icons/Media/add-circle.svg";
import Home from "./components/Home/Home";
import Search from "./components/Search/Search";
import ReactYoutube from "./components/ReactYoutube/ReactYoutube";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";

import Store from "./context";
import reducer from "./reducer";

import { usePersistedContext, usePersistedReducer } from "./usePersist";
import PlaylistListItem from "./components/PlaylistListItem/PlaylistListItem";
import Queue from "./components/Queue/Queue";

function App() {
  const [player, setPlayer] = useState(null);
  const [playerState, setPlayerState] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [repeatOne, setRepeatOne] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);

  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  const globalStore = usePersistedContext(useContext(Store), "state");
  const [state, dispatch] = usePersistedReducer(
    useReducer(reducer, globalStore),
    "state"
  );

  const handlePlayerReady = (playerInstance) => {
    setPlayer(playerInstance);
  };

  const handleStageChange = () => {
    if (repeatOne && player.getPlayerState() === 0) {
      player.seekTo(0);
    } else if (!repeatOne && player.getPlayerState() === 0) {
      changeMusic(1);
    }
    setPlayerState(player.getPlayerState());
    console.log("Handle");
  };

  const handleProgressChange = () => {
    console.log(progressRef.current.value);
    player.seekTo(progressRef.current.value);
  };

  const playMusic = (item) => {
    console.log(item);
    dispatch({ type: "updateCurrentMusic", payload: item });
    dispatch({ type: "updateQueue", payload: [item] });
    dispatch({ type: "updateQueueId", payload: 0 });
    progressRef.current.value = 0;
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

  useEffect(() => {
    player?.setVolume(state.volume);
  }, [state.volume]);

  const formatSec = (elapsed_sec) => {
    const min = Math.floor(elapsed_sec / 60);
    const seconds = Math.floor(elapsed_sec - min * 60);

    return min.toString() + ":" + seconds.toString().padStart(2, "0");
  };

  useEffect(() => {
    player?.setVolume(state.volume);
    const interval = setInterval(async () => {
      const elapsed_sec = await player?.getCurrentTime(); // this is a promise. dont forget to await
      setElapsed(formatSec(elapsed_sec || 0));
      setElapsedSec(elapsed_sec);
      state.currentMusic && (progressRef.current.value = elapsed_sec);
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
    } else if (player.getPlayerState() == 2 || player.getPlayerState() == -1) {
      playVideo();
    }
  };

  const onRepeatButton = () => {
    setRepeatOne((pre) => !pre);
  };

  const onQueueButton = () => {
    setShowQueue((pre) => !pre);
  };

  const onVideoButton = () => {
    setShowVideo((pre) => !pre);
  };

  const onVolumeButton = () => {
    if (state.volume !== 0 && player.getVolume() !== 0) {
      player.setVolume(0);
      volumeRef.current.value = 0;
    } else if (player.getVolume() === 0) {
      player.setVolume(state.volume);
      volumeRef.current.value = state.volume;
    }
  };

  document.onkeydown = (event) => {
    if (event.keyCode !== 32 || event.target.matches("input")) return;

    toggleVideo();
  };

  document.onclick = function (event) {
    if (
      event.target.id !== "addPlaylist" &&
      event.target.id !== "addImage" &&
      event.target.id !== "addButton"
    ) {
      setShowAddPlaylist(false);
    }
  };

  const changeMusic = (n) => {
    if (n === -1 && elapsedSec > 3) {
      player.seekTo(0);
      return;
    }
    if (state.queue_id + n < 0) {
      dispatch({
        type: "updateCurrentMusic",
        payload: state.queue[state.queue.length - 1],
      });
      dispatch({ type: "updateQueueId", payload: state.queue.length - 1 });
    } else {
      dispatch({
        type: "updateCurrentMusic",
        payload: state.queue[(state.queue_id + n) % state.queue.length],
      });
      dispatch({
        type: "updateQueueId",
        payload: (state.queue_id + n) % state.queue.length,
      });
    }
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
                  <PlaylistListItem
                    data={{
                      thumbnail:
                        "https://misc.scdn.co/liked-songs/liked-songs-64.png",
                      title: "Liked Songs",
                      channelName: "Playlist • 147 songs",
                    }}
                  />
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
            <div
              style={{ right: showVideo ? "0px" : "-320px" }}
              className={styles.videoDiv}
            >
              <ReactYoutube
                className={styles.player}
                videoId={state.currentMusic?.id.videoId}
                onPlayerReady={handlePlayerReady}
                onStateChange={handleStageChange}
              ></ReactYoutube>
            </div>
            <div
              style={{ bottom: showQueue ? "86px" : "-620px" }}
              className={styles.queueDiv}
            >
              <div className={styles.queueTopBar}>
                <div
                  style={{
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  Queue
                </div>
                <IconButton
                  id="moreButton"
                  className={styles.moreButton}
                  aria-label="more"
                  onClick={(e) => {
                    setShowQueue(false);
                  }}
                >
                  <CloseIcon className={styles.moreIcon} />
                </IconButton>
              </div>
              <Queue />
            </div>
            <div className={styles.infoDiv}>
              <div className={styles.currentImageDiv}>
                <img
                  src={state.currentMusic?.snippet.thumbnails.default.url}
                  className={styles.currentImage}
                ></img>
              </div>
              <div className={styles.currentTextDiv}>
                <span className={styles.currentTitle}>
                  {state.currentMusic?.snippet.title}
                </span>
                <span className={styles.currentDesc}>
                  {state.currentMusic?.snippet.channelTitle}
                </span>
              </div>
              {state.currentMusic && (
                <div className={styles.addDiv}>
                  <div
                    style={{ display: showAddPlaylist ? "block" : "none" }}
                    className={styles.addPlaylist}
                    id="addPlaylist"
                  ></div>
                  <button
                    onClick={() => setShowAddPlaylist((pre) => !pre)}
                    className={styles.addButton}
                    id="addButton"
                  >
                    <img
                      id="addImage"
                      className={styles.addImage}
                      src={AddIcon}
                    ></img>
                  </button>
                </div>
              )}
            </div>
            <div className={styles.controllerDiv}>
              <div className={styles.mediaButtons}>
                <div className={styles.leftMedia}>
                  <button
                    onClick={() => {
                      changeMusic(-1);
                    }}
                    className={styles.nextButton}
                  >
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
                  <button
                    onClick={() => {
                      changeMusic(1);
                    }}
                    on
                    className={styles.nextButton}
                  >
                    <img
                      className={styles.nextImg}
                      src={NextIcon}
                      alt="Next"
                    ></img>
                  </button>
                  <button
                    onClick={onRepeatButton}
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
                  {formatSec(player?.getDuration() || 0)}
                </span>
              </div>
            </div>
            <div className={styles.buttonsDiv}>
              <button onClick={onQueueButton} className={styles.nextButton}>
                <img className={styles.nextImg} src={QueueIcon} alt="Queue" />
              </button>
              <button onClick={onVideoButton} className={styles.nextButton}>
                <img className={styles.nextImg} src={YoutubeIcon} alt="Video" />
              </button>
              <div className={styles.volumeDiv}>
                <button onClick={onVolumeButton} className={styles.nextButton}>
                  <img
                    className={styles.nextImg}
                    src={
                      volumeRef.current?.value > 50
                        ? Sound2Icon
                        : volumeRef.current?.value > 0
                        ? Sound1Icon
                        : SoundOffIcon
                    }
                    alt="Volume"
                  />
                </button>
                <div className={styles.progressDiv} style={{ width: "95px" }}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={state.volume}
                    ref={volumeRef}
                    onChange={(e) => {
                      dispatch({
                        type: "updateVolume",
                        payload: e.target.value,
                      });
                    }}
                  ></input>
                  {progressRef.current && (
                    <div
                      style={{
                        width:
                          "calc(" + volumeRef?.current.value.toString() + "% )",
                      }}
                      className={styles.progress}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </Store.Provider>
  );
}

export default App;
