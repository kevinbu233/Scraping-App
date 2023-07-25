import Switch from "@mui/material/Switch";
import React, { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import Grid from "@mui/material/Grid";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useMediaQuery from '@mui/material/useMediaQuery';

function Setting() {
  const [selected, setSelected] = React.useState({
    ebay: true,
    facebook: true,
    etsy: true,
  });

  const [properties, setProperties] = useState({
    ebay: {
      order: "default",
      sold: false,
      priceMin: "hi",
      priceMax: 10000,
    },
    facebook: {
      order: "default",
      sold: false,
      priceMin: 0,
      priceMax: 10000,
    },
    etsy: {
      order: "default",
      priceMin: 0,
      priceMax: 10000,
    },
  });
  const [cookies, setCookie, removeCookies] = useCookies(null);
  const [showNumber, setShowNumber] = useState(5);
  const userEmail = cookies.Email;
  const smallScreen = useMediaQuery('(max-width: 500px)')

  const handleSelection = (event) => {
    setSelected({
      ...selected,
      [event.target.name]: event.target.checked,
    });
  };

  const handleproperties = (event, website, field) => {
    let value = event.target.value;
    if (field === "sold") {
      value = event.target.checked;
    }
    // } else if (field !== "order") {
    //   value = parseInt(event.target.value, 10);
    // }

    const data = { ...properties[website], [field]: value };
    setProperties({
      ...properties,
      [website]: data,
    });
  };

  const saveSetting = async (e) => {
    e.preventDefault();
    for (const key in properties) {
      for (const prop in properties[key]) {
        if (prop === "priceMin" || prop === "priceMax") {
          try {
            const value = parseInt(properties[key][prop], 10);
            if (isNaN(value)) {
              alert("Prices need to be integers");
              return;
            }
            properties[key][prop] = value;
          } catch (err) {}
        }
      }
    }
    if (isNaN(showNumber)) {
      alert("Number of Entires need to be integers");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/properties/${userEmail}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checked: selected,
            properties: properties,
            number: showNumber,
          }),
        }
      );
      if (response.status === 200) {
        console.log("WORKED");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getProperties = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/settings/${userEmail}`
      );
      const json = await response.json();
      setSelected({
        ebay: json.ebay,
        facebook: json.facebook,
        etsy: json.etsy,
      });
      setProperties({
        ebay: {
          order: json.ebay_order,
          priceMin: json.ebay_min,
          priceMax: json.ebay_max,
          sold: json.ebay_sold,
        },
        facebook: {
          order: json.facebook_order,
          sold: json.facebook_sold,
          priceMin: json.facebook_min,
          priceMax: json.facebook_max,
        },
        etsy: {
          order: json.etsy_order,
          priceMin: json.etsy_min,
          priceMax: json.etsy_max,
        },
      });
      setShowNumber(json.show_num);
      
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getProperties();
  }, []);



  return (
    
    <div>
      {smallScreen ? 
    <FormControl component="fieldset" variant="standard">
      <Grid container spacing={1} sx={{px: 0.5 }} justifyContent="space-between">
        <Grid item xs={1.5}>
          <FormControlLabel
          sx={{mx: 0.5 }}
            control={
              <Switch
              size="small"
              
                checked={selected.ebay}
                onChange={handleSelection}
                name="ebay"
              />
            }
            labelPlacement="bottom"
            label="Ebay"
          />
        </Grid>
        <Grid item xs={2.5}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Order</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="ebay order"
              onChange={(e) => handleproperties(e, "ebay", "order")}
              value={properties.ebay.order}
            >
              <MenuItem value={"default" || undefined}>Default</MenuItem>
              <MenuItem value={"ending_soonest"}>Ending Soonest</MenuItem>
              <MenuItem value={"newly_listed"}>Newly Listed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
          sx={{mx: 0.5 }}
            control={
              <Switch
                size="small"
                checked={properties.ebay.sold}
                onChange={(e) => handleproperties(e, "ebay", "sold")}
                name="ebay sold"
              />
            }
            label="Sold"
            labelPlacement="bottom"
          />
        </Grid>
        <Grid item xs={2.5}>
          <TextField
            id="outlined-basic"
            label="Min Price"
            variant="outlined"
            name="ebay price_min"
            value={properties.ebay.priceMin}
            onChange={(event) => {
              handleproperties(event, "ebay", "priceMin");
            }}
          />
        </Grid>
        <Grid item xs={2.5}>
          <TextField
            id="outlined-basic"
            label="Max Price"
            variant="outlined"
            name="ebay price_max"
            value={properties.ebay.priceMax}
            onChange={(event) => {
              handleproperties(event, "ebay", "priceMax");
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <FormControlLabel
          sx={{mx: 0.5 }}
            control={
              <Switch
              size ="small"
                checked={selected.facebook}
                onChange={handleSelection}
                name="facebook"
              />
            }
            label="FB"
            labelPlacement="bottom"
          />
        </Grid>
        <Grid item xs={2.5}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Order</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="facebook"
              value={properties.facebook.order}
              onChange={(e) => handleproperties(e, "facebook", "order")}
            >
              <MenuItem value={"default" || undefined}>Default</MenuItem>
              <MenuItem value={"last_7_days"}>Last 7 Days</MenuItem>
              <MenuItem value={"last_30_days"}>Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            sx={{mx: 0.5 }}
            control={
              <Switch
              size="small"
                checked={properties.facebook.sold}
                onChange={(e) => handleproperties(e, "facebook", "sold")}
                name="facebook sold"
              />
            }
            label="Sold"
            labelPlacement="bottom"
          />
        </Grid>
        <Grid item xs={2.5}>
          <TextField
            id="outlined-basic"
            label="Min Price"
            variant="outlined"
            value={properties.facebook.priceMin}
            onChange={(event) => {
              handleproperties(event, "facebook", "priceMin");
            }}
          />
        </Grid>
        <Grid item xs={2.5}>
          <TextField
            id="outlined-basic"
            label="Max Price"
            variant="outlined"
            value={properties.facebook.priceMax}
            onChange={(event) => {
              handleproperties(event, "facebook", "priceMax");
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
          sx={{mx: 0.5 }}
            control={
              <Switch
                size="small"
                checked={selected.etsy}
                onChange={handleSelection}
                name="etsy"
              />
            }
            label="Etsy"
            labelPlacement="bottom"
          />
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Order</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Etsy"
              value={properties.etsy.order}
              onChange={(e) => handleproperties(e, "etsy", "order")}
            >
              <MenuItem value={"default" || ""}>Default</MenuItem>
              <MenuItem value={"most_recent"}>Most Recent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-basic"
            label="Min Price"
            variant="outlined"
            value={properties.etsy.priceMin}
            onChange={(event) => {
              handleproperties(event, "etsy", "priceMin");
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-basic"
            label="Max Price"
            variant="outlined"
            value={properties.etsy.priceMax}
            onChange={(event) => {
              handleproperties(event, "etsy", "priceMax");
            }}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            id="outlined-basic"
            label="Number of Entries"
            variant="outlined"
            value={showNumber}
            onChange={(e) => {
              setShowNumber(e.target.value);
            }}
          />
        </Grid>
        {/* <Grid item xs={6}></Grid> */}
        <Grid item xs={3}>
          <button variant="outlined" color="error" onClick={saveSetting}>
            Save properties
          </button> 
        </Grid>
      </Grid>
      </FormControl>
    
    :
 
    <FormControl component="fieldset" variant="standard">
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={3.5}>
          <FormControlLabel
            control={
              <Switch
                checked={selected.ebay}
                onChange={handleSelection}
                name="ebay"
              />
            }
            label="Ebay"
          />
        </Grid>
        <Grid item xs={2.5}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Order</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="ebay order"
              onChange={(e) => handleproperties(e, "ebay", "order")}
              value={properties.ebay.order}
            >
              <MenuItem value={"default" || undefined}>Default</MenuItem>
              <MenuItem value={"ending_soonest"}>Ending Soonest</MenuItem>
              <MenuItem value={"newly_listed"}>Newly Listed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            control={
              <Switch
                checked={properties.ebay.sold}
                onChange={(e) => handleproperties(e, "ebay", "sold")}
                name="ebay sold"
              />
            }
            label="Sold Only"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="outlined-basic"
            label="Min Price"
            variant="outlined"
            name="ebay price_min"
            value={properties.ebay.priceMin}
            onChange={(event) => {
              handleproperties(event, "ebay", "priceMin");
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="outlined-basic"
            label="Max Price"
            variant="outlined"
            name="ebay price_max"
            value={properties.ebay.priceMax}
            onChange={(event) => {
              handleproperties(event, "ebay", "priceMax");
            }}
          />
        </Grid>
        <Grid item xs={3.5}>
          <FormControlLabel
            control={
              <Switch
                checked={selected.facebook}
                onChange={handleSelection}
                name="facebook"
              />
            }
            label="Facebook"
          />
        </Grid>
        <Grid item xs={2.5}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Order</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="facebook"
              value={properties.facebook.order}
              onChange={(e) => handleproperties(e, "facebook", "order")}
            >
              <MenuItem value={"default" || undefined}>Default</MenuItem>
              <MenuItem value={"last_7_days"}>Last 7 Days</MenuItem>
              <MenuItem value={"last_30_days"}>Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            control={
              <Switch
                checked={properties.facebook.sold}
                onChange={(e) => handleproperties(e, "facebook", "sold")}
                name="facebook sold"
              />
            }
            label="Sold Only"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="outlined-basic"
            label="Min Price"
            variant="outlined"
            value={properties.facebook.priceMin}
            onChange={(event) => {
              handleproperties(event, "facebook", "priceMin");
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="outlined-basic"
            label="Max Price"
            variant="outlined"
            value={properties.facebook.priceMax}
            onChange={(event) => {
              handleproperties(event, "facebook", "priceMax");
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            control={
              <Switch
                checked={selected.etsy}
                onChange={handleSelection}
                name="etsy"
              />
            }
            label="Etsy"
          />
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Order</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Etsy"
              value={properties.etsy.order}
              onChange={(e) => handleproperties(e, "etsy", "order")}
            >
              <MenuItem value={"default" || ""}>Default</MenuItem>
              <MenuItem value={"most_recent"}>Most Recent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-basic"
            label="Min Price"
            variant="outlined"
            value={properties.etsy.priceMin}
            onChange={(event) => {
              handleproperties(event, "etsy", "priceMin");
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-basic"
            label="Max Price"
            variant="outlined"
            value={properties.etsy.priceMax}
            onChange={(event) => {
              handleproperties(event, "etsy", "priceMax");
            }}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            id="outlined-basic"
            label="Number of Entries"
            variant="outlined"
            value={showNumber}
            onChange={(e) => {
              setShowNumber(e.target.value);
            }}
          />
        </Grid>
        {/* <Grid item xs={6}></Grid> */}
        <Grid item xs={3}>
          <Button variant="outlined" color="error" onClick={saveSetting}>
            Save properties
          </Button>
        </Grid>
      </Grid>
      </FormControl>} 
    </div>
  );
}

export default Setting;
