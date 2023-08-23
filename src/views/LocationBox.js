//MUI
import { Grid, IconButton } from "@mui/material";
//React
import React, { useCallback, useState } from "react";
//Components
import LocationAutocomplite from "../components/LocationAutocomplete";
//Icon
import SyncAltTwoToneIcon from "@mui/icons-material/SyncAltTwoTone";

const LocationBox = () => {
  const [locationFrom, setLocationFrom] = useState(null);
  const [locationTo, setLocationTo] = useState(null);

  const handleSwitchContent = useCallback(() => {
    setLocationFrom(locationTo);
    setLocationTo(locationFrom);
  }, [locationTo, locationFrom]);

  return (
    <Grid container spacing={2} p={2} alignItems={"center"}>
      <Grid item md={5.5} xs={12}>
        <LocationAutocomplite
          value={locationFrom}
          setter={(_v) => setLocationFrom(_v)}
          label={"From"}
        />
      </Grid>
      <Grid
        item
        md={1}
        xs={12}
        sx={{
          borderRadius: "50%",
          alignItems: "center",
        }}
      >
        <IconButton onClick={handleSwitchContent}>
          <SyncAltTwoToneIcon />
        </IconButton>
      </Grid>
      <Grid item md={5.5} xs={12}>
        <LocationAutocomplite
          value={locationTo}
          setter={(_v) => setLocationTo(_v)}
          label={"To"}
        />
      </Grid>
    </Grid>
  );
};

export default LocationBox;
