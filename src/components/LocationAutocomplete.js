//MUI
import { Autocomplete, TextField } from "@mui/material";
//React
import React, { useCallback } from "react";
//Dummy Data
const dummyOptions = ["asdasd", "asdasdasdasd", "xcvxcvxcv", "asdasdasd"];

const LocationAutocomplite = ({ value, setter, label }) => {
  const onChangeHandler = useCallback(
    (v) => {
      setter(v);
    },
    [setter]
  );

  return (
    <Autocomplete
      options={dummyOptions} //from api
      value={value}
      onChange={(_e, v) => onChangeHandler(v)}
      renderInput={(params) => <TextField label={label} {...params} />}
    />
  );
};

export default LocationAutocomplite;
