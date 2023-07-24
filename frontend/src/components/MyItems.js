import ListHeader from "./ListHeader";
import {useCallback, useEffect, useState} from 'react'
import ListItem from "./ListItem";
import SearchBar from "./SearchBar";
import Auth from "./Auth"
import BasicTabs from "./Tabs"
import { useCookies } from "react-cookie";


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';





const MyItems = () => {
  const [cookies, setCookie, removeCookies] = useCookies(null)
  const userEmail = cookies.Email
  const authToken = cookies.AuthToken
  const [items, setitems] = useState(null)
  

  const getData =  useCallback(async() => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/items/${userEmail}`)
      const json = await response.json()
      setitems(json)
      
    } catch(err) {
      console.error(err)
    }
  }, [])

  useEffect(()=> {
    if (authToken) {
      getData()
    }
  }, [])
  


  // Sort by date
  const sorteditems = items?.sort((a,b)=> a.date - b.date)

  


  
  return (
    <div>
        {sorteditems?.map((item) => <ListItem key = {item.id} item = {item} type="delete" getData = {getData}/>)}
    </div>
  );
}



export default MyItems;
