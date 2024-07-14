import React from "react";

const Store = React.createContext({
  playlists: [
    {
      id: "0",
      title: "Liked Songs",
      thumbnail: "https://misc.scdn.co/liked-songs/liked-songs-64.png",
      content: [],
    },
  ],
  queue: [],
  queue_id: 0,
  search_queries: [],
  volume: 75,
  currentMusic: null,
});

export default Store;
