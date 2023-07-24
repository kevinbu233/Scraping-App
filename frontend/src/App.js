import ListHeader from "./components/ListHeader";
import {useEffect, useState} from 'react'
import ListItem from "./components/ListItem";
import SearchBar from "./components/SearchBar";
import Auth from "./components/Auth"
import BasicTabs from "./components/Tabs"
import { useCookies } from "react-cookie";


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MyItems from "./components/MyItems"
import useMediaQuery from '@mui/material/useMediaQuery';



const App = () => {
  const [cookies, setCookie, removeCookies] = useCookies(null)
  const userEmail = cookies.Email
  const authToken = cookies.AuthToken
  const smallScreen = useMediaQuery('(max-width: 500px)')

  return (
    <div className="app">
      {!authToken && <Auth/>}
      {authToken && 
      <>
        <ListHeader listName = {"Find the Antique"} />
        {!smallScreen && <p className="user-email">Welcome back {userEmail}</p>}
        <BasicTabs />

      </>}
    </div>
  );
}



export default App;
