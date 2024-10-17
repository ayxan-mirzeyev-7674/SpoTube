import styles from "./Search.module.css";
import SearchIcon from "../../icons/search.svg";
import Arrow from "../../icons/arrow.svg";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import API_CONFIG from "../../APIConfig";
import SearchResults from "../SearchResults/SearchResults";
import Store from "../../context";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import QueueIcon from "@mui/icons-material/Queue";

function Search({ data }) {
  const { state, dispatch } = useContext(Store);
  const [query, setQuery] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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

  function handleKeyDown(key) {
    if (key === "Enter" && query && query !== "") {
      console.log("Submit: " + query);
      handleSearch(query);
      setShowSuggestions(false);
    }
  }

  useEffect(() => {
    if (query === "" || !query) {
      setSuggestions(state.search_queries);
      return;
    }
    const fetchSuggestions = async () => {
      if (query) {
        try {
          const response = await axios.get(
            `https://html-css-js-yh7s.onrender.com/suggestions?q=${query}`
          );
          setSuggestions(response.data[1]);
          console.log(response.data[1]);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [query]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  const suggestionClicked = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const suggestionCopied = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(true);
  };

  async function handleSearch(searchQuery) {
    const response = await axios({
      method: "get",
      url: API_CONFIG.yt_search_endpoint({ searchQuery }),
      responseType: "json",
    });

    const items = (response.data.items || []).filter(
      (_) => _.id.kind === "youtube#video"
    );
    setSearchResults([]);
    setSearchResults(items);
    let search_queries = state.search_queries;
    if (!search_queries.includes(searchQuery)) {
      search_queries.unshift(searchQuery);
      dispatch({ type: "updateSearchQueries", payload: search_queries });
    } else {
      let indexElem = search_queries.indexOf(searchQuery);
      search_queries.splice(indexElem, 1);
      search_queries.unshift(searchQuery);
      dispatch({ type: "updateSearchQueries", payload: search_queries });
    }
  }

  const onAddToQueue = () => {
    setMenu(null);
    dispatch({ type: "updateQueue", payload: [...state.queue, selecteditem] });
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchContainer}>
        <label className={styles.searchBarLabel} htmlFor="searchBar">
          <div className={styles.searchBar}>
            <img alt="search" src={SearchIcon}></img>
            <input
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onFocus={() => {
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false);
                }, 100);
              }}
              onKeyDown={(e) => {
                handleKeyDown(e.key);
              }}
              id="searchBar"
              type="text"
              placeholder="What do you want to play?"
              value={query ? query : ""}
              autoComplete="off"
            ></input>
          </div>
        </label>
        {suggestions.length > 0 && showSuggestions && (
          <div className={styles.suggestionsDiv}>
            {suggestions.map((suggestion, index) => (
              <div key={index} className={styles.singleSuggestionDiv}>
                <button
                  onClick={() => {
                    suggestionClicked(suggestion);
                  }}
                  className={styles.suggestionButton}
                >
                  {suggestion}
                </button>
                <button
                  onClick={() => {
                    suggestionCopied(suggestion);
                  }}
                  className={styles.suggestionCopyButton}
                >
                  <img style={{ width: "20px" }} src={Arrow} alt="Copy" />
                </button>
              </div>
            ))}
          </div>
        )}
        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            <p
              style={{
                color: "white",
                fontWeight: "900",
                fontSize: "25px",
                marginBottom: "10px",
                marginTop: "5px",
                paddingLeft: "20px",
              }}
            >
              Search Results
            </p>
            {searchResults.map((item, index) => (
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
        )}
      </div>
    </div>
  );
}

export default Search;
