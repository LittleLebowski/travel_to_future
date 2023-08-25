//React
import React, { useCallback, useEffect, useState } from "react";
//MUI
import { Box, Paper, Stack } from "@mui/material";
//Componenets
import TripTypeRadioGroup from "../components/TripTypeRadioGroup";
//Views
import LocationBox from "./LocationBox";
import DateBox from "./DateBox";
//Enums
import { DEPARTURE, RETURN } from "../enums/datePickerEnums";

function MainPage() {
  const [hasReturnTrip, setHasReturnTrip] = useState(true);
  const [departureReturnDate, setDepartureReturnDate] = useState({
    [DEPARTURE]: "",
    [RETURN]: "",
  });

  const handleDateChange = useCallback((key, value) => {
    setDepartureReturnDate((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const handleTripTypeChange = useCallback((v) => {
    setHasReturnTrip(!!v);
  }, []);

  return (
    <Box p={8}>
      <Paper>
        <TripTypeRadioGroup
          hasReturnTrip={hasReturnTrip}
          handleTripTypeChange={handleTripTypeChange}
        />
        <Stack
          alignItems={"center"}
          justifyContent={"space-between"}
          direction={"row"}
        >
          <LocationBox />
          <DateBox
            hasReturnTrip={hasReturnTrip}
            departureReturnDate={departureReturnDate}
            handleDateChange={handleDateChange}
          />
        </Stack>
      </Paper>
    </Box>
  );
}

export default MainPage;
