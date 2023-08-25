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

const LocationBox = () => {
  const [locationFrom, setLocationFrom] = useState(null);
  const [locationTo, setLocationTo] = useState(null);

  const [flightData, setFlightData] = useState([]);
  const [flightDataLoading, setFlightDataLoading] = useState(true);

  const [destinationData, setDestinationData] = useState([]);
  const [destinationDataLoading, setDestinationDataLoading] = useState(true);

  //API call
  useEffect(() => {
    setFlightDataLoading(true);
    const apiUrl =
      "https://dummyflightdata-default-rtdb.europe-west1.firebasedatabase.app/flights.json";
    axios
      .get(apiUrl)
      .then((resp) => {
        const tmpRespData = resp.data;

        setFlightData(tmpRespData);
        setDestinationDataLoading(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setFlightDataLoading(false);
      });
  }, []);

  const getDestinationData = useCallback(
    (locationFromId, isSwitch = false, switchId = null) => {
      setDestinationDataLoading(true);

      let apiUrl = `https://dummyflightdata-default-rtdb.europe-west1.firebasedatabase.app/flights/${locationFromId}.json`;

      axios
        .get(apiUrl)
        .then((resp) => {
          const tmpDestinationData = resp.data.destinationFlights;
          setDestinationData(tmpDestinationData);

          if (isSwitch) {
            const tmpLocationTo = tmpDestinationData.find(
              (item) => item.id === switchId
            );
            console.log(tmpLocationTo, "tmpLocationTo");
            setLocationTo(tmpLocationTo ?? null);
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
    const locationToId = locationTo?.id;
    const locationFromId = locationFrom?.id;

    getDestinationData(locationToId, true, locationFromId);

    setLocationFrom(flightData[locationToId]);
  }, [flightData, locationTo, locationFrom, getDestinationData]);

  const handleFromLocationChange = useCallback(
    (value) => {
      setLocationFrom(value);
      getDestinationData(value.id);
    },
    [getDestinationData]
  );

  const handleToLocationChange = useCallback((value) => {
    setLocationTo(value);
  }, []);

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
          value={locationFrom}
          options={flightData}
          handleFunction={handleFromLocationChange}
          label={"From"}
          dataLoading={flightDataLoading}
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
          disabled={_.isEmpty(locationTo)}
          onClick={handleSwitchContent}
        >
          <SyncAltTwoToneIcon />
        </IconButton>
      </Box>
      <Box flex={1}>
        <LocationAutocomplite
          value={locationTo}
          options={destinationData}
          handleFunction={handleToLocationChange}
          label={"To"}
          dataLoading={destinationDataLoading}
          waitingText={
            _.isNull(locationFrom)
              ? "Select a departure airport"
              : "Waiting for options to load"
          }
        />
      </Box>
    </Stack>
  );
};

export default LocationBox;
