//MUI
import { Box, IconButton, Stack } from "@mui/material";
//React
import React, { useCallback, useState, useEffect } from "react";
//Components
import LocationAutocomplite from "../components/LocationAutocomplete";
//Icon
import SyncAltTwoToneIcon from "@mui/icons-material/SyncAltTwoTone";
//Third-Party
import axios from "axios";
import _ from "lodash";
//Enums
import { DEPARTURE, LANDING } from "../enums/locationEnums";

const LocationBox = ({ handleTripRoute }) => {
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

  const getDestinationData = useCallback(
    (locationFromId, isSwitch = false, switchId = null) => {
      setDestinationDataLoading(true);

      let landinApiUrl = `https://dummyflightdata-default-rtdb.europe-west1.firebasedatabase.app/flights/${locationFromId}.json`;

      axios
        .get(landinApiUrl)
        .then((resp) => {
          const tmpDestinationData = resp.data.destinationFlights;
          setDestinationData(tmpDestinationData);

          if (isSwitch) {
            const tmpLocationTo = tmpDestinationData.find(
              (item) => item.id === switchId
            );
            setLandingLocation(tmpLocationTo ?? null);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setDestinationDataLoading(false);
        });
    },
    []
  );

  const handleSwitchContent = useCallback(() => {
    const departureLocationId = landingLocation?.id;
    const landingLocationId = departureLocation?.id;

    handleTripRoute(DEPARTURE, landingLocation);
    handleTripRoute(LANDING, departureLocation);

    getDestinationData(departureLocationId, true, landingLocationId);

    setDepartureLocation(departureData[departureLocationId]);
  }, [
    departureData,
    landingLocation,
    departureLocation,
    getDestinationData,
    handleTripRoute,
  ]);

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
      alignItems={"center"}
      direction={"row"}
      width={"50%"}
    >
      <Box flex={1}>
        <LocationAutocomplite
          value={departureLocation}
          options={departureData}
          handleFunction={handleDepartureLocationChange}
          label={"From"}
          dataLoading={departureDataLoading}
        />
      </Box>
      <Box
        sx={{
          borderRadius: "50%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          disabled={_.isEmpty(landingLocation)}
          onClick={handleSwitchContent}
        >
          <SyncAltTwoToneIcon />
        </IconButton>
      </Box>
      <Box flex={1}>
        <LocationAutocomplite
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
