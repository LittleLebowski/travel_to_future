//React
import React, { useCallback, useEffect, useMemo, useState } from "react";
//MUI
import { Button, Card, Paper, Stack, Typography } from "@mui/material";
//Componenets
import TripTypeRadioGroup from "../components/TripTypeRadioGroup";
//Views
import LocationBox from "./LocationBox";
import DateBox from "./DateBox";
import FlightList from "./FlightList";
//Third-Party
import axios from "axios";
import _ from "lodash";
//Helpers
import {
  calculateArrivalTime,
  createCustomDateTime,
  timeFormatter,
} from "../helper/timeZoneHelper";

function MainPage() {
  const [hasReturnTrip, setHasReturnTrip] = useState(true);
  const [showList, setShowList] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [cityTimeZones, setCityTimeZones] = useState();

  const [tripRoute, setTripRoute] = useState({ departure: "", landing: "" });

  const [departureReturnDate, setDepartureReturnDate] = useState({
    departure: null,
    return: null,
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
    (
      departure,
      destination,
      airportName,
      date,
      departuretime,
      duration,
      departureId,
      landingId,
      departureTimeZone,
      landingTimeZone
    ) => {
      let flightDurationInHours = duration / 60;

      let arrivalTime = calculateArrivalTime(
        departuretime,
        parseInt(departureTimeZone.gmt),
        flightDurationInHours,
        parseInt(landingTimeZone.gmt)
      );

      return {
        departure: departure,
        destination: destination,
        airportName: airportName,
        date: date,
        departuretime: departuretime,
        arrivalTime: arrivalTime,
        duration: duration,
        departureId: departureId,
        landingId: landingId,
      };
    },
    []
  );

  useEffect(() => {
    let timeZonesUrl = `https://dummyflightdata-default-rtdb.europe-west1.firebasedatabase.app/timeZones.json`;
    axios
      .get(timeZonesUrl)
      .then((resp) => {
        setCityTimeZones(resp.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const getFlightItems = useCallback(
    (departureId, landingId, day) => {
      const departureDay = new Date(day).getDay();
      let departureTimeZone = cityTimeZones.find(
        (item) => Number(item.id) === Number(departureId)
      );

      let landingTimeZone = cityTimeZones.find(
        (item) => Number(item.id) === Number(landingId)
      );
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
                  createCustomDateTime(
                    day,
                    item?.departureTime,
                    departureTimeZone.gmt
                  ),
                  item?.flightDuration,
                  departureId,
                  landingId,
                  departureTimeZone,
                  landingTimeZone
                );
              })
            : [];

          setFlightOptions(filteredData);
          setShowList(true);
        })
        .catch((err) => console.error(err));
    },
    [itemCreater, cityTimeZones]
  );

  const selectionSize = useMemo(() => {
    //if there is a return flight make 2 selection
    if (hasReturnTrip) {
      return 2;
    } else return 1;
  }, [hasReturnTrip]);

  const handleFlightData = useCallback(
    (selectedItemObj, returnDay = null) => {
      !_.isNull(selectedItemObj) &&
        setSelectedItem((prevState) => [...prevState, selectedItemObj]);

      hasReturnTrip &&
        getFlightItems(tripRoute.landing.id, tripRoute.departure.id, returnDay);
    },
    [getFlightItems, tripRoute, hasReturnTrip]
  );

  useEffect(() => {
    console.log(flightOptions, "flightOptions xxx");
  }, [flightOptions]);

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
            handleDateChange={(key, value) => handleDateChange(key, value)}
          />
          <Button
            onClick={() => {
              setSelectedItem([]); //on new search clear selected items
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
        <>
          {Array.isArray(selectedItem) && !_.isEmpty(selectedItem) && (
            <Stack spacing={1}>
              {selectedItem.map((item, index) => {
                return (
                  <Card bgcolor={"yellow"} key={`#${index}`}>
                    <Typography>{`Departure: ${item.departure}`}</Typography>
                    <Typography>{`Destination: ${item.destination}`}</Typography>
                    <Typography>{`Flight Duration:${
                      item.duration + " min" ?? "Unknown"
                    }`}</Typography>
                    <Typography>{`Airport Name:${item.airportName}`}</Typography>
                    <Typography>{`Date: ${item.date.toDateString()}`}</Typography>
                    <Typography>{`Departure Time:${
                      timeFormatter.format(item.departuretime) ?? "Unknown"
                    } `}</Typography>
                    <Typography>{`Landing Time:${
                      timeFormatter.format(item.arrivalTime) ?? "Unknown"
                    } `}</Typography>
                  </Card>
                );
              })}
            </Stack>
          )}
          {selectedItem.length !== selectionSize && (
            <FlightList
              flightOptions={flightOptions}
              handleFlightData={handleFlightData}
              departureReturnDate={departureReturnDate}
            />
          )}
        </>
      )}
    </Stack>
  );
}

export default MainPage;
