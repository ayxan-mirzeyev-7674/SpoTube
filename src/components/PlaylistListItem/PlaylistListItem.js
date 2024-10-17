import styles from "./PlaylistListItem.module.css";
import DefaultIcon from "../../icons/graymusic.jpg";
import { useNavigate } from "react-router-dom";

function PlaylistListItem({ data }) {
  const navigate = useNavigate();

  const navigateToPage = () => {
    navigate("playlist/" + data.id);
  };
  return (
    <button onClick={navigateToPage} className={styles.main}>
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
