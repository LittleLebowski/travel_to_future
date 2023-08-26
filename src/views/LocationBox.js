//MUI
import { Box, Stack } from "@mui/material";
//React
import React, { useCallback, useState, useEffect } from "react";
//Components
import LocationAutocomplite from "../components/LocationAutocomplete";
//Third-Party
import axios from "axios";
import _ from "lodash";
//Enums
import { DEPARTURE, LANDING } from "../enums/locationEnums";

const LocationBox = ({ handleTripRoute, handleErrorObject, errorObject }) => {
  const [departureLocation, setDepartureLocation] = useState(null);
  const [landingLocation, setLandingLocation] = useState(null);

  const [departureData, setDepartureData] = useState([]);
  const [departureDataLoading, setDepartureDataLoading] = useState(true);

  const [destinationData, setDestinationData] = useState([]);
  const [destinationDataLoading, setDestinationDataLoading] = useState(true);

  //API call
  useEffect(() => {
    setDepartureDataLoading(true);
    const departureApiUrl =
      "https://dummyflightdata-default-rtdb.europe-west1.firebasedatabase.app/flights.json";
    axios
      .get(departureApiUrl)
      .then((resp) => {
        const tmpRespData = resp.data;

        setDepartureData(tmpRespData);
        setDestinationDataLoading(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setDepartureDataLoading(false);
      });
  }, []);

  const getDestinationData = useCallback((locationFromId) => {
    setDestinationDataLoading(true);

    let landinApiUrl = `https://dummyflightdata-default-rtdb.europe-west1.firebasedatabase.app/flights/${locationFromId}.json`;

    axios
      .get(landinApiUrl)
      .then((resp) => {
        setLandingLocation(null);
        const tmpDestinationData = resp.data.destinationFlights;
        setDestinationData(tmpDestinationData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setDestinationDataLoading(false);
      });
  }, []);

  const handleDepartureLocationChange = useCallback(
    (value) => {
      handleTripRoute(DEPARTURE, value);
      setDepartureLocation(value);
      getDestinationData(value.id);
    },
    [getDestinationData, handleTripRoute]
  );

  const handleDestinationLocationChange = useCallback(
    (value) => {
      handleTripRoute(LANDING, value);
      setLandingLocation(value);
    },
    [handleTripRoute]
  );

  return (
    <Stack
      p={2}
      spacing={2}
      justifyContent={"space-between"}
      direction={"row"}
      width={"40%"}
    >
      <Box flex={1} minHeight={"88px"}>
        {/* minHeight is to evade moving of the box when there is an error  */}
        <LocationAutocomplite
          errorKey={"departurePlace"}
          handleErrorObject={handleErrorObject}
          errorValue={errorObject.departurePlace}
          value={departureLocation}
          options={departureData}
          handleFunction={handleDepartureLocationChange}
          label={"From"}
          dataLoading={departureDataLoading}
        />
      </Box>
      <Box flex={1} minHeight={"88px"}>
        {/* minHeight is to evade moving of the box when there is an error  */}
        <LocationAutocomplite
          errorKey={"landingPlace"}
          handleErrorObject={handleErrorObject}
          errorValue={errorObject.landingPlace}
          value={landingLocation}
          options={destinationData}
          handleFunction={handleDestinationLocationChange}
          label={"To"}
          dataLoading={destinationDataLoading}
          waitingText={
            _.isNull(departureLocation)
              ? "Select a departure airport"
              : "Waiting for options to load"
          }
        />
      </Box>
    </Stack>
  );
};

export default LocationBox;
