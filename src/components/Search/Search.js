import styles from "./Search.module.css";
import SearchIcon from "../../icons/search.svg";
import Arrow from "../../icons/arrow.svg";
import { useEffect, useState } from "react";
import axios from "axios";

function Search() {
  const [query, setQuery] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleKeyDown(key) {
    if (key === "Enter" && query && query !== "") {
      console.log("Submit: " + query);
    }
  }

  async function suggest() {
    console.log("Query: " + query);
    const response = await fetch(
      `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube-reduced&hl=en&gs_ri=youtube-reduced&ds=yt&cp=3&gs_id=100&q=${query}&xhr=t&xssi=t&gl=us`
    );
    const text = await response.text();
    const jsonText = text.substring(4); // Remove ")]}'" from the start of the response
    const jsonData = JSON.parse(jsonText);
    const suggestionsData = jsonData[1].map((item) => item[0]);
    console.log(suggestionsData);
    setSuggestions(suggestionsData);
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
            `http://localhost:4000/suggestions?q=${query}`
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

  const suggestionClicked = (suggestion) => {
    console.log(suggestion);
  };

  const suggestionCopied = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(true);
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchContainer}>
        <label className={styles.searchBarLabel} htmlFor="searchBar">
          <div className={styles.searchBar}>
            <img src={SearchIcon}></img>
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
      </div>
    </div>
  );
}

export default Search;
