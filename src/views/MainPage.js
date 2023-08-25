//React
import React, { useCallback, useEffect, useState } from "react";
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
import { locationEnumsMap } from "../enums/locationEnums";

function MainPage() {
  const [hasReturnTrip, setHasReturnTrip] = useState(true);

  const [tripRoute, setTripRoute] = useState({ departure: "", landing: "" });

  const [departureReturnDate, setDepartureReturnDate] = useState({
    departure: "",
    return: "",
  });

  const [flightOptions, setFlightOptions] = useState();

  const [cardData, setCardData] = useState();

  const handleDateChange = useCallback((key, value) => {
    setDepartureReturnDate((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const handleTripTypeChange = useCallback((v) => {
    setHasReturnTrip(!!v);
  }, []);

  const handleTripRoute = useCallback((key, value) => {
    setTripRoute((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const handleCardData = useCallback((tripRoutes, date) => {
    setCardData({
      originLocation: tripRoutes.departure.id,
      destinationLocation: tripRoutes.landing.id,
      destinationAirPort: tripRoutes.landing.destinationAirport,
      date: date,
    });
  }, []);

  const getFilteredFlightItems = useCallback(
    (dates, tripRoutes) => {
      const departureDay = new Date(dates.departure).getDay();
      const returnDate = new Date(dates.return).getDay();

      let departureApiUrl = `https://dummyflightdata-default-rtdb.europe-west1.firebasedatabase.app/flights/${tripRoutes.departure.id}/destinationFlights/${tripRoutes.landing.id}/departureTimes/${departureDay}.json`;
      let landinApiUrl = `https://dummyflightdata-default-rtdb.europe-west1.firebasedatabase.app/flights/${tripRoutes.landing.id}/destinationFlights/${tripRoutes.departure.id}/departureTimes/${returnDate}.json`;

      axios
        .get(departureApiUrl)
        .then((resp) => {
          setFlightOptions(resp.data);
          handleCardData(tripRoutes, dates.departure);
        })
        .catch((err) => console.error(err))
        .finally(() => {
          console.log("Done");
        });
    },
    [handleCardData]
  );

  useEffect(() => {
    console.log(departureReturnDate, "date");
    console.log(tripRoute, "route");
    console.log(hasReturnTrip, "hasreturn");
    console.log(flightOptions, "flightOptions");
  }, [departureReturnDate, tripRoute, hasReturnTrip, flightOptions]);

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
            onClick={() =>
              getFilteredFlightItems(departureReturnDate, tripRoute)
            }
          >
            Search For Flight
          </Button>
        </Stack>
      </Paper>
      {!!flightOptions && !_.isEmpty(flightOptions) && (
        <Stack spacing={1}>
          {/* originLocation: tripRoutes.departure.label,
      destinationLocation: tripRoutes.landing.label,
      flightDuration: tripRoutes.landing.flightDuration,
      destinationAirPort: tripRoutes.landing.destinationAirport,
      date: date, */}
          {flightOptions.flights.map((item, index) => (
            <Card key={index}>
              <Typography>{`Departure: ${locationEnumsMap.get(
                cardData.originLocation
              )}`}</Typography>
              <Typography>{`Destination: ${locationEnumsMap.get(
                cardData.destinationLocation
              )}`}</Typography>
              <Typography>{`Flight Duration: ${cardData.flightDuration}`}</Typography>
              <Typography>{`Airport Name:${cardData.destinationAirPort}`}</Typography>
              <Typography>{`Date: ${cardData.date}`}</Typography>
              <Typography>{`Time: -`}</Typography>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
// {`Departure: ${flightOptions.departureLocation} | Landing: ${
//   flightOptions.landigLocation
// } | Departure Date: ${
//   flightOptions.departureDay
// } | Departure Time: ${flightOptions.date.flights.map(
//   (item, index) => `${item.departureTime}`
// )} "`}

export default MainPage;
