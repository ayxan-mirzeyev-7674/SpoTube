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
            selected: selectedOnes.includes(item),
          }}
        />
      ))}
    </div>
  );
}

export default AddPlaylistModal;
