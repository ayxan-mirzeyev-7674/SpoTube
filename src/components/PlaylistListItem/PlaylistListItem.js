import styles from "./PlaylistListItem.module.css";
import DefaultIcon from "../../icons/graymusic.jpeg";

function PlaylistListItem({ data }) {
  return (
    <button onClick={data.playMusic} className={styles.main}>
      <div className={styles.thumbDiv}>
        <img
          alt="thumbnail"
          src={data.thumbnail || DefaultIcon}
          className={styles.thumbnail}
        ></img>
      </div>
      <div className={styles.textDiv}>
        <p className={styles.title}>{data.title}</p>
        <p className={styles.desc}>Playlist • {data.length} songs</p>
      </div>
    </button>
  );
}

export default PlaylistListItem;
