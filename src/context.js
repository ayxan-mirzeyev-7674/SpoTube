import React from "react";

const Store = React.createContext({
  playlists: [{ title: "Liked Songs", content: [] }],
  queue: [],
  queue_id: 0,
  search_queries: [],
  volume: 75,
  currentMusic: null,
});

export default Store;
