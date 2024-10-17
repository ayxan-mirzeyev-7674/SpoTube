import styles from "./AddPlaylistItem.module.css";
import DefaultIcon from "../../icons/graymusic.jpg";
import TickIcon from "../../icons/Media/tick-circle.svg";

function PlaylistListItem({ data }) {
  return (
    <button
      id="addPlayListItem"
      onClick={data.togglePlaylist}
      className={styles.main}
    >
      <div className={styles.thumbDiv}>
        <img
          alt="thumbnail"
          src={data.thumbnail || DefaultIcon}
          className={styles.thumbnail}
        ></img>
      </div>
      <div className={styles.textDiv}>
        <p className={styles.title}>{data.title}</p>
      </div>
      <div className={styles.selectedTick}>
        {data.selected && <img src={TickIcon} className={styles.tickIcon} />}
      </div>
    </button>
  );
}

export default PlaylistListItem;
