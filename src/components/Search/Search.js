import styles from "./Search.module.css";
import SearchIcon from "../../icons/search.svg";
import Arrow from "../../icons/arrow.svg";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import API_CONFIG from "../../APIConfig";
import SearchResults from "../SearchResults/SearchResults";
import Store from "../../context";

function Search({ data }) {
  const { state, dispatch } = useContext(Store);
  const [query, setQuery] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  function handleKeyDown(key) {
    if (key === "Enter" && query && query !== "") {
      console.log("Submit: " + query);
      handleSearch(query);
      setShowSuggestions(false);
    }
  }

  useEffect(() => {
    if (query === "" || !query) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      if (query) {
        try {
          const response = await axios.get(
            `http://192.168.31.94:4000/suggestions?q=${query}`
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
    setSearchResults(items);
    let search_queries = state.search_queries;
    search_queries.push(searchQuery);
    dispatch({ type: "updateSearchQueries", payload: search_queries });
  }

  return (
    <div className={styles.main}>
      {state.search_queries.map((item) => item)}
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
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
