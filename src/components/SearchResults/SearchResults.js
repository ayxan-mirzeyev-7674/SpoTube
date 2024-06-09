import styles from "./SearchResults.module.css";
import PlayIcon from "../../icons/play.svg";

function SearchResults({ data }) {
  return (
    <button onClick={data.playMusic} className={styles.main}>
      <div className={styles.thumbDiv}>
        <img
          alt="thumnail"
          src={data.thumbnail}
          className={styles.thumbnail}
        ></img>
        <img src={PlayIcon} alt="Play" className={styles.playIcon} />
      </div>
      <div className={styles.textDiv}>
        <p className={styles.title}>{data.title}</p>
        <p className={styles.desc}>{data.channelName}</p>
      </div>
    </button>
  );
}

export default SearchResults;
