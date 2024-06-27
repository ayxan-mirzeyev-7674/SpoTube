import PlayIcon from "../../icons/play.svg";
import styles from "./QueueItem.module.css";
import Store from "../../context";
import { useContext } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";

function QueueItem({ data }) {
  const { state, dispatch } = useContext(Store);

  const onPlay = () => {
    dispatch({
      type: "updateCurrentMusic",
      payload: state.queue[data.queueId],
    });
    dispatch({
      type: "updateQueueId",
      payload: data.queueId,
    });
  };

  return (
    <div className={styles.mainDiv}>
      <button onClick={onPlay} className={styles.main}>
        <div className={styles.thumbDiv}>
          <img
            alt="thumnail"
            src={data.thumbnail}
            className={styles.thumbnail}
          ></img>
          <img src={PlayIcon} alt="Play" className={styles.playIcon} />
        </div>
        <div className={styles.textDiv}>
          <p
            style={{
              color:
                data.queueId === state.queue_id
                  ? "rgb(28,198,88)"
                  : "rgb(255,255,255)",
            }}
            className={styles.title}
          >
            {data.title}
          </p>
          <p className={styles.desc}>{data.channelName}</p>
        </div>
      </button>
      <IconButton
        id="moreButton"
        className={styles.moreButton}
        aria-label="more"
        onClick={(e) => {
          data.handleMenu(e);
        }}
      >
        <MoreHorizIcon className={styles.moreIcon} />
      </IconButton>
    </div>
  );
}

export default QueueItem;
