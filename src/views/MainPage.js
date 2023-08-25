//React
import React, { useCallback, useMemo, useState } from "react";
//MUI
import { Button, Card, Paper, Stack, Typography } from "@mui/material";
//Componenets
import TripTypeRadioGroup from "../components/TripTypeRadioGroup";
//Views
import LocationBox from "./LocationBox";
import DateBox from "./DateBox";
//Third-Party
import axios from "axios";
import _ from "lodash";
//Enums
// import { locationEnumsMap } from "../enums/locationEnums";
// import { DEPARTURE, RETURN } from "../enums/datePickerEnums";

function MainPage() {
  const [hasReturnTrip, setHasReturnTrip] = useState(true);
  const [showList, setShowList] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);

  const [tripRoute, setTripRoute] = useState({ departure: "", landing: "" });

  const [departureReturnDate, setDepartureReturnDate] = useState({
    departure: "",
    return: "",
  });

  const [flightOptions, setFlightOptions] = useState();

  const handleDateChange = useCallback((key, value) => {
    setDepartureReturnDate((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const handleTripTypeChange = useCallback((v) => {
    //On trip type change reset return date and close list
    setHasReturnTrip(!!v);
    setShowList(false);
    setDepartureReturnDate((prevState) => ({ ...prevState, return: "" }));
  }, []);

  const handleTripRoute = useCallback((key, value) => {
    setTripRoute((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const itemCreater = useCallback(
    (departure, destination, airportName, date, time, duration) => {
      return {
        departure: departure,
        destination: destination,
        airportName: airportName,
        date: date,
        time: time,
        duration: duration,
      };
    },
    []
  );

  const isReturnDataFilled = useMemo(() => {
    return hasReturnTrip && selectedItem.length !== 2;
  }, [selectedItem, hasReturnTrip]);

  const getFlightItems = useCallback(
    (departureId, landingId, day) => {
      const departureDay = new Date(day).getDay();

      let landingApiUrl = `https://dummyflightdata-default-rtdb.europe-west1.firebasedatabase.app/flights.json`;
      axios
        .get(landingApiUrl)
        .then((resp) => {
          let tmpData = resp.data;
          let departureData = tmpData.find((item) => item.id === departureId);

          let landingData = departureData.destinationFlights.find(
            (item) => item.id === landingId
          );

          let filteredData = landingData.departureTimes[departureDay].flights
            ? landingData.departureTimes[departureDay].flights.map((item) => {
                return itemCreater(
                  landingData.originLocation,
                  landingData.destinationLocation,
                  landingData.destinationAirport,
                  day,
                  item?.departureTime,
                  item?.flightDuration
                );
              })
            : [];

          setFlightOptions(filteredData);
          setShowList(true);
        })
        .catch((err) => console.error(err));
    },
    [itemCreater]
  );

  const handleFlightData = useCallback(
    (selectedItemObj, returnDay) => {
      !_.isNull(selectedItemObj) &&
        setSelectedItem((prevState) => [...prevState, selectedItemObj]);

      selectedItem.length < 2 &&
        getFlightItems(tripRoute.landing.id, tripRoute.departure.id, returnDay);
    },
    [getFlightItems, tripRoute, selectedItem]
  );

  const nextPage = useCallback(() => {
    console.log("next page");
  }, []);

  return (
    <Stack p={8} spacing={1}>
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
          <LocationBox handleTripRoute={handleTripRoute} />
          <DateBox
            hasReturnTrip={hasReturnTrip}
            departureReturnDate={departureReturnDate}
            handleDateChange={handleDateChange}
          />
          <Button
            onClick={() => {
              getFlightItems(
                tripRoute.departure.id,
                tripRoute.landing.id,
                departureReturnDate.departure
              );
            }}
          >
            Search For Flight
          </Button>
        </Stack>
      </Paper>

      {showList && (
        <Stack spacing={1}>
          <Stack direction={"row"} spacing={1}>
            <Button>Sort By Flight Duration</Button>
            <Button>Sort By Departure Time</Button>
            <Button>Sort By Landing Time</Button>
          </Stack>
          {!!flightOptions && !_.isEmpty(flightOptions) ? (
            flightOptions.map((item, index) => (
              <Card key={index}>
                <Typography>{`Departure: ${item.departure}`}</Typography>
                <Typography>{`Destination: ${item.destination}`}</Typography>
                <Typography>{`Flight Duration:${
                  item.duration + " min" ?? "Unknown"
                }`}</Typography>
                <Typography>{`Airport Name:${item.airportName}`}</Typography>
                <Typography>{`Date: ${item.date}`}</Typography>
                <Typography>{`Time:${item.time ?? "Unknown"} `}</Typography>
                <Button
                  onClick={() =>
                    isReturnDataFilled
                      ? handleFlightData(item, departureReturnDate.return)
                      : nextPage()
                  }
                >
                  Select
                </Button>
              </Card>
            ))
          ) : (
            <Card>
              <Typography>No Flight</Typography>
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default MainPage;
