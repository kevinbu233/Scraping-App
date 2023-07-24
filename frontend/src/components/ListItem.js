import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
import { useState } from "react";
import { useCookies } from "react-cookie";
import Modal from "./Modal";
import Grid from "@mui/material/Grid";
import useMediaQuery from '@mui/material/useMediaQuery';

const ListItem = ({ item, type, getData}) => {
  const [showButton, setShowButton] = useState(true);
  const [cookies, setCookie, removeCookies] = useCookies(null);
  const userEmail = cookies.Email;
  const smallScreen = useMediaQuery('(max-width:500px)')
  const deleteItem = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/items/${item.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const postData = async (e) => {
    const data = { ...item };
    data.date = new Date();
    data.user_email = userEmail;
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/myItems/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        console.log("WORKED");
        setShowButton(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <li className="list-item">
      <div className="info-container">
        {smallScreen ? 
        <Grid container spacing={1} justifyContent="space-between">
          <Grid item xs={2} alignItems="center">
            {showButton ? (
              type === "delete" ? (
                <button className="delete" onClick={(e) => deleteItem(e)}>
                  Delete
                </button>
              ) : (
                <button className="delete" onClick={(e) => postData(e)}>
                  Add
                </button>
              )
            ) : (
              "ADDED TO YOUR LIST"
            )}
          </Grid>
          <Grid item xs={3.5} alignItems="center" style={{ flexGrow: 1 }}>
            <a className="item-title" href={item.product_url} target="_blank">
             {item.product_name.slice(0,40)}
            </a>
          </Grid>
          <Grid item xs={2} alignItems="center">
            {item.price}
          </Grid>
          <Grid item xs={1.5} alignItems="center">
            {item.website}
          </Grid>
          <Grid item xs={3} alignItems="center">
            <img src={item.image}></img>
          </Grid>
        </Grid> :
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={1} alignItems="center">
            {showButton ? (
              type === "delete" ? (
                <button className="delete" onClick={(e) => deleteItem(e)}>
                  Delete
                </button>
              ) : (
                <button className="delete" onClick={(e) => postData(e)}>
                  Add
                </button>
              )
            ) : (
              "ADDED TO YOUR LIST"
            )}
          </Grid>
          <Grid item xs={4} alignItems="center" style={{ flexGrow: 1 }}>
            {item.product_name}
          </Grid>
          <Grid item xs={2} alignItems="center">
            {item.price}
          </Grid>
          <Grid item xs={1} alignItems="center">
            <a className="item-title" href={item.product_url} target="_blank">
              Link
            </a>
          </Grid>
          <Grid item xs={1} alignItems="center">
            {item.website}
          </Grid>
          <Grid item xs={3} alignItems="center">
            <img src={item.image}></img>
          </Grid>
        </Grid>}
        {/* <TickIcon />
          <p className="item-title">{item.product_name}</p>
          <p className="item-title">{item.price}</p>
          <img src={item.image} ></img>
           */}
        {/* <ProgressBar progress={item.progress}/> */}
      </div>

      {/* <div className='button-container'>
          <button className='edit' onClick={()=>setShowModal(true)}>EDIT</button>
          <button className='delete' onClick={()=>deleteItem()}>DELETE</button>
        </div> */}
      {/* {showModal && <Modal mode={'edit'} setShowModal={setShowModal} item={item} getData={getData}/>} */}
    </li>
  );
};

export default ListItem;
