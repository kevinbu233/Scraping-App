import ListHeader from "./components/ListHeader";

import Auth from "./components/Auth"
import BasicTabs from "./components/Tabs"
import { useCookies } from "react-cookie";


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
