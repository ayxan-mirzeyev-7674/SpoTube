import { useParams } from "react-router-dom";
import styles from "./PlayListView.module.css";
import Store from "../../context";
import { useContext, useEffect, useState } from "react";
import SearchResults from "../SearchResults/SearchResults";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import QueueIcon from "@mui/icons-material/Queue";

function PlayListView({ data }) {
  const { state, dispatch } = useContext(Store);
  const { id } = useParams();
  const currentPlaylist = state.playlists.find((element) => element.id === id);

  const [menu, setMenu] = useState(null);
  const [coordinate, setCoordinate] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
  const open = Boolean(menu);

  const handleClick = (e, item) => {
    setMenu(e.currentTarget);
    setSelectedItem(item);
    setCoordinate({
      top: e.clientY + 20,
      left: e.clientX - 50,
    });
  };

  const onAddToQueue = () => {
    setMenu(null);
    dispatch({ type: "updateQueue", payload: [...state.queue, selecteditem] });
  };

  return (
    <div style={{ color: "white" }}>
      PlayList Title : {currentPlaylist?.title}
      {currentPlaylist?.content.map((item, index) => (
        <SearchResults
          key={index}
          data={{
            title: item.snippet.title,
            channelName: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url,
            id: item.id.videoId,
            playMusic: () => {
              data.playMusic(item);
            },
            handleContextMenu: (e, item) => handleClick(e, item),
            item,
          }}
        />
      ))}
      <Menu
        open={open}
        onClose={() => setMenu(null)}
        anchorEl={menu}
        anchorReference="anchorPosition"
        anchorPosition={
          open != null
            ? { top: coordinate?.top, left: coordinate?.left }
            : undefined
        }
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "rgb(40,40,40)",
            color: "rgba(255, 255, 255, 0.9)",
          },
          "& .MuiButtonBase-root": {
            gap: "10px",
            fontSize: "14px",
          },
        }}
      >
        <MenuItem onClick={onAddToQueue}>
          <QueueIcon fontSize="small" />
          Add to queue
        </MenuItem>
      </Menu>
    </div>
  );
}

export default PlayListView;
