import styles from "./SearchResults.module.css";
import PlayIcon from "../../icons/play.svg";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

function SearchResults({ data }) {
  return (
    <div className={styles.mainDiv}>
      <button
        onClick={(e) => {
          if (e.target.id !== "moreButton") {
            data.playMusic();
          }
        }}
        className={styles.main}
      >
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
      <IconButton
        id="moreButton"
        className={styles.moreButton}
        aria-label="more"
        onClick={(e) => {
          data.handleContextMenu(e, data.item);
        }}
      >
        <MoreVertIcon sx={{ color: "white" }} />
      </IconButton>
    </div>
  );
}

export default SearchResults;
