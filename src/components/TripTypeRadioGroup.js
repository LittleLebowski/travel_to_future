//MUI
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
//React
import React, { useState } from "react";

//Local Enums
const RETURN = 0;
const ONE_WAY = 1;

const TripTypeRadioGroup = () => {
  const [tripType, setTripType] = useState(RETURN);

  const handleChange = (_e) => {
    setTripType(_e.target.value);
  };

  return (
    <FormControl sx={{ px: 4, py: 1 }}>
      <RadioGroup
        row
        aria-labelledby="radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={tripType}
        onChange={handleChange}
      >
        <FormControlLabel value={RETURN} control={<Radio />} label="Return" />
        <FormControlLabel value={ONE_WAY} control={<Radio />} label="One Way" />
      </RadioGroup>
    </FormControl>
  );
};

export default TripTypeRadioGroup;
