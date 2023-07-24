import _ from "lodash";
import React, { useState, useEffect, useCallback } from "react";
import { Grid } from "semantic-ui-react";
import ListItem from "./ListItem";
import Button from '@mui/material/Button';

function SearchBar({handleSearch, results}) {
  // const [state, dispatch] = React.useReducer(exampleReducer, initialState);
  const [search, setSearch] = useState("");
  // const [results, setResults] = useState(null);

  const timeoutRef = React.useRef();
  // const handleSearch = useCallback((e, data) => {
  //   clearTimeout(timeoutRef.current);

  //   console.log(data)
  //   timeoutRef.current = setTimeout(() => {
  //     if (data === "") {
  //       return;
  //     }
      
  //     const getData = async () => {
  //       try {
  //         const res = await fetch(`${process.env.REACT_APP_SERVERURL}/search/${data}`)
  //         const json = await res.json()
  //         setResults(json)
  //     } catch(err) {
  //       console.error(err)
  //     }
  //     }
  //     getData()
      
      
  //   }, 300);
  // }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (event) => {
    const newInputValue = event.currentTarget.value;
    setTimeout(() => {
      setSearch(newInputValue);
    }, 200);
  };

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      handleSearch(search)
    }
  }

  return (
    // <Grid>
    //   <Grid.Column width={6}>
        <div class="ui search">
          <input
            type="text"
            placeholder="Seach..."
            onChange={handleChange}
            onKeyDown={handleEnter}
          ></input>
          <Button variant="contained" onClick={() => handleSearch(search)}>Search</Button>
          {/* <button
            className="search-button"
            
          >
            Search
          </button> */}
          <div className="search-results"></div>
           {results?.map((item, index) => <ListItem key = {index} item = {item} type ="Add"/>)}
        </div>
    //   </Grid.Column>
      
    // </Grid>
   
  );
}

export default SearchBar;
