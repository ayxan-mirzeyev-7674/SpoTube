import { useContext, useEffect, useState } from "react";
import Store from "../../context";
import AddPlaylistItem from "../AddPlaylistItem/AddPlaylistItem";

function AddPlaylistModal() {
  const { state, dispatch } = useContext(Store);
  const [selectedOnes, setSelectedOnes] = useState([]);

  useEffect(() => {
    setSelectedOnes(
      state.playlists.filter(
        (item) =>
          item.content.filter(
            (element) => element.id.videoId === state.currentMusic.id.videoId
          ).length > 0
      )
    );
  }, [state.currentMusic]);

  useEffect(() => {
    console.log(selectedOnes);
  }, [selectedOnes]);

  const toggleItem = (item) => {
    let playlistsCopy = [...state.playlists];
    if (selectedOnes.includes(item)) {
      setSelectedOnes((prev) =>
        prev.filter((selectedItem) => selectedItem !== item)
      );
      for (let i = 0; i < playlistsCopy.length; i++) {
        if (playlistsCopy[i].id === item.id) {
          playlistsCopy[i].content = playlistsCopy[i].content.filter(
            (music) => music.id.videoId !== state.currentMusic.id.videoId
          );
          break;
        }
      }
    } else {
      setSelectedOnes((prev) => [...prev, item]);
      for (let i = 0; i < playlistsCopy.length; i++) {
        if (playlistsCopy[i].id === item.id) {
          playlistsCopy[i].content.push(state.currentMusic);
          break;
        }
      }
    }
    dispatch({ type: "createNewPlaylist", payload: playlistsCopy });
  };

  return (
    <div>
      {" "}
      {state.playlists.map((item, index) => (
        <AddPlaylistItem
          key={index}
          data={{
            thumbnail: item.thumbnail,
            title: item.title,
            item: item,
            selected: selectedOnes?.includes(item),
            togglePlaylist: () => toggleItem(item),
          }}
        />
      ))}
    </div>
  );
}

export default AddPlaylistModal;
