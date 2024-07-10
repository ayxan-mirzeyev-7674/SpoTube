import styles from "./Queue.module.css";
import Store from "../../context";
import { useContext, useState } from "react";
import QueueItem from "../QueueItem/QueueItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import DraggableList from "../DraggableList/DraggableList";

function Queue() {
  const { state, dispatch } = useContext(Store);

  const [menu, setMenu] = useState(null);
  const [coordinate, setCoordinate] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
  const open = Boolean(menu);

  const onRemoveFromQueue = () => {
    console.log(selecteditem);
    let queueCopy = [...state.queue];
    queueCopy.splice(selecteditem, 1);
    if (selecteditem !== state.queue_id) {
      dispatch({ type: "updateQueue", payload: queueCopy });
      if (selecteditem < state.queue_id) {
        dispatch({ type: "updateQueueId", payload: state.queue_id - 1 });
      }
      setMenu(null);
    }
  };

  return (
    <div className={styles.main}>
      {state.queue.map((item, index) => (
        <QueueItem
          key={index}
          data={{
            title: item.snippet.title,
            channelName: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url,
            id: item.id.videoId,
            queueId: index,
            handleMenu: (e) => {
              setSelectedItem(index);
              setCoordinate({
                top: e.clientY + 20,
                left: e.clientX - 50,
              });
              setMenu(e.currentTarget);
            },
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
        <MenuItem
          disabled={selecteditem === state.queue_id}
          onClick={onRemoveFromQueue}
        >
          <DeleteIcon fontSize="small" />
          Remove from queue
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Queue;
