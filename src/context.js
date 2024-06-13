import React from "react";

const Store = React.createContext({
  playlists: [],
  queue: [],
  search_queries: [],
});

export default Store;
