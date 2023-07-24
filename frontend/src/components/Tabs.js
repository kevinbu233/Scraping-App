import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MyItems from './MyItems';
import SearchBar from './SearchBar';
import { useState, useEffect, useCallback } from "react";
import Setting from './Setting';
import { useCookies } from "react-cookie";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2, px: 0.5 }}>
             <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [results, setResults] = useState(null)
  const [settings, setSettings] = useState(null)
  const [cookies, setCookie, removeCookies] = useCookies(null);
  const userEmail = cookies.Email;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const timeoutRef = React.useRef();

  const handleSearch = useCallback((data) => {
    clearTimeout(timeoutRef.current);

    console.log(data)
    timeoutRef.current = setTimeout(() => {
      if (data === "") {
        return;
      }
      
      const getData = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_SERVERURL}/search/?query=${data}&userEmail=${userEmail}`)
          const json = await res.json()
          setResults(json)
      } catch(err) {
        console.error(err)
      }
      }
      getData()
      
      
    }, 300);
  }, []);



  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Search New Item" {...a11yProps(0)} />
          <Tab label="My Items" {...a11yProps(1)} />
          <Tab label="Setting" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <SearchBar handleSearch = {handleSearch} results = {results}/>
        
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MyItems />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Setting />
      </CustomTabPanel>
    </Box>
  );
}


