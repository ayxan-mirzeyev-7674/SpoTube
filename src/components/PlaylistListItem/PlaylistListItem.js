import styles from "./PlaylistListItem.module.css";

function PlaylistListItem({ data }) {
  return (
    <button onClick={data.playMusic} className={styles.main}>
      <div className={styles.thumbDiv}>
        <img
          alt="thumnail"
          src={data.thumbnail}
          className={styles.thumbnail}
        ></img>
      </div>
      <div className={styles.textDiv}>
        <p className={styles.title}>{data.title}</p>
        <p className={styles.desc}>{data.channelName}</p>
      </div>
    </button>
  );
}

export default PlaylistListItem;
