import styles from "./AddPlaylistItem.module.css";
import DefaultIcon from "../../icons/graymusic.jpeg";

function PlaylistListItem({ data }) {
  return (
    <button
      id="addPlayListItem"
      onClick={data.playMusic}
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
        {data.selected && <p>Selected</p>}
      </div>
    </button>
  );
}

export default PlaylistListItem;
