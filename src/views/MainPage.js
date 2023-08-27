//React
import React, { useCallback, useEffect, useMemo, useState } from "react";

//MUI
import {
  Box,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

//Componenets
import TripTypeRadioGroup from "../components/TripTypeRadioGroup";
import LazyListener from "../components/lazyListener/LazyListener";
import CustomCard from "../components/CustomCard";
import CustomButton from "../components/CustomButton";

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
} from "../helper/timeZoneHelper";

import SearchIcon from "@mui/icons-material/Search";

import { SMALL_SCREEN_SIZE } from "../enums/screenSizing";

function MainPage() {
  const [hasReturnTrip, setHasReturnTrip] = useState(true);
  const [showList, setShowList] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [cityTimeZones, setCityTimeZones] = useState();
  const [waiting, setWaiting] = useState(false);

  const [errorObject, setErrorObject] = useState({
    departurePlace: false,
    landingPlace: false,
    departure: false,
    return: false,
  });

  const [tripRoute, setTripRoute] = useState({ departure: "", landing: "" });

  const [departureReturnDate, setDepartureReturnDate] = useState({
    departure: null,
    return: null,
  });

  const [flightOptions, setFlightOptions] = useState();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(
    theme.breakpoints.down(SMALL_SCREEN_SIZE)
  );

  const handleErrorObject = useCallback((key, value) => {
    setErrorObject((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const handleDateChange = useCallback(
    (key, value) => {
      setDepartureReturnDate((prevState) => ({ ...prevState, [key]: value }));
      handleErrorObject(key, false);
    },
    [handleErrorObject]
  );

  const handleTripTypeChange = useCallback((v) => {
    //On trip type change reset return date and close list
    setHasReturnTrip(Boolean(v));
    setShowList(false);

    setDepartureReturnDate({ departure: null, return: null });
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
      landingTimeZone,
      fee,
      airline
    ) => {
      let flightDurationInHours = duration / 60;

      let arrivalTime = calculateArrivalTime(
        departuretime,
        parseInt(departureTimeZone.gmt),
        flightDurationInHours,
        parseInt(landingTimeZone.gmt)
      );
      let departureLocation =
        departure.charAt(0).toUpperCase() + departure.slice(1);
      let destinationLocation =
        destination.charAt(0).toUpperCase() + destination.slice(1);
      return {
        departure: departureLocation,
        destination: destinationLocation,
        airportName: airportName,
        date: date,
        departuretime: departuretime,
        arrivalTime: arrivalTime,
        duration: duration,
        departureId: departureId,
        landingId: landingId,
        fee: fee,
        airline: airline,
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
      setWaiting(true);
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
                  landingTimeZone,
                  item.flightFee,
                  item.flightBrand
                );
              })
            : [];

          setFlightOptions(filteredData);
          setShowList(true);
        })
        .catch((err) => console.error(err))
        .finally(() => setWaiting(false));
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

  const handleSearchClick = useCallback(
    (departureid, landingid, departureDate) => {
      setSelectedItem([]); //on new search clear selected items
      if (
        _.isEmpty(tripRoute.departure) ||
        _.isEmpty(tripRoute.landing) ||
        _.isNull(departureReturnDate.departure) ||
        (hasReturnTrip && _.isNull(departureReturnDate.return))
      ) {
        handleErrorObject("departurePlace", _.isEmpty(tripRoute.departure));
        handleErrorObject("landingPlace", _.isEmpty(tripRoute.landing));
        handleErrorObject("departure", _.isNull(departureReturnDate.departure));
        if (hasReturnTrip)
          handleErrorObject("return", _.isNull(departureReturnDate.return));
      } else {
        getFlightItems(departureid, landingid, departureDate);
      }
    },
    [
      departureReturnDate,
      getFlightItems,
      handleErrorObject,
      hasReturnTrip,
      tripRoute,
    ]
  );

  return (
    <Stack
      maxWidth={"952px"}
      mx={isSmallScreen ? 2 : "auto"}
      mt={2}
      p={2}
      borderRadius={3}
      spacing={2}
      bgcolor={"#F9F9F9"}
    >
      <Paper elevation={3}>
        <TripTypeRadioGroup
          hasReturnTrip={hasReturnTrip}
          handleTripTypeChange={handleTripTypeChange}
        />
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          minHeight={"88px"}
          flexWrap={"wrap"}
        >
          <LocationBox
            handleTripRoute={handleTripRoute}
            handleErrorObject={(key, value) => handleErrorObject(key, value)}
            errorObject={errorObject}
          />

          <DateBox
            handleErrorObject={(key, value) => handleErrorObject(key, value)}
            errorObject={errorObject}
            hasReturnTrip={hasReturnTrip}
            departureReturnDate={departureReturnDate}
            handleDateChange={(key, value) => handleDateChange(key, value)}
          />
          <Stack p={2} flex={1}>
            <CustomButton
              fullWidth
              text={"Search Flight"}
              hoverColor={"#fc0522"}
              endIcon={<SearchIcon sx={{ color: "#FFFFFF" }} />}
              style={{
                backgroundColor: "#E81932",
                height: "56px",
              }}
              onClick={() => {
                handleSearchClick(
                  tripRoute.departure.id,
                  tripRoute.landing.id,
                  departureReturnDate.departure
                );
              }}
            />
          </Stack>
        </Stack>
      </Paper>

      {showList && (
        <LazyListener listen={waiting}>
          {Array.isArray(selectedItem) && !_.isEmpty(selectedItem) && (
            <Stack
              spacing={2}
              pt={1}
              bgcolor={"#2B3947"}
              p={2}
              borderRadius={1}
            >
              {selectedItem.map((item, index) => {
                let title = index === 0 ? "Departure Date" : "Return Date";
                return (
                  <Stack key={index}>
                    <Box px={3}>
                      <Typography
                        color={"white"}
                        fontWeight={600}
                        fontSize={18}
                      >{`${title}: ${item.date.toDateString()}`}</Typography>
                    </Box>
                    <CustomCard key={index} item={item} />
                  </Stack>
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
        </LazyListener>
      )}
    </Stack>
  );
}

export default MainPage;
