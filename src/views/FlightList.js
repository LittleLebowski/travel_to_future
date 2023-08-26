//React
import React, { useCallback, useMemo, useState } from "react";
//MUI
import { Button, Card, Stack, Typography } from "@mui/material";
//Third-Party
import _ from "lodash";
//helper
import { timeFormatter } from "../helper/timeZoneHelper";

const FlightList = ({
  flightOptions,
  handleFlightData,
  departureReturnDate,
}) => {
  const [sortingOptions, setSortingOptions] = useState({
    isAscending: false,
    sortBy: "duration",
  });

  const handleSortingOptions = useCallback((sortBy) => {
    setSortingOptions((prevState) => ({
      ...prevState,
      isAscending: !prevState.isAscending,
      sortBy: sortBy,
    }));
  }, []);

  const sorter = useCallback((flightOptions, sortingOptions) => {
    if (!_.isEmpty(flightOptions)) {
      sortingOptions.isAscending
        ? flightOptions.sort(
            (a, b) => b[sortingOptions.sortBy] - a[sortingOptions.sortBy]
          )
        : flightOptions.sort(
            (a, b) => a[sortingOptions.sortBy] - b[sortingOptions.sortBy]
          );
    }
    return flightOptions;
  }, []);

  const sortedFlightOptions = useMemo(() => {
    let flightOptionsCopy = _.cloneDeep(flightOptions);

    return sorter(flightOptionsCopy, sortingOptions);
  }, [flightOptions, sortingOptions, sorter]);

  return (
    <Stack spacing={1}>
      <Stack direction={"row"} spacing={1}>
        <Button onClick={() => handleSortingOptions("duration")}>
          Sort By Flight Duration
        </Button>
        <Button onClick={() => handleSortingOptions("departuretime")}>
          Sort By Departure Time
        </Button>
        <Button onClick={() => handleSortingOptions("arrivalTime")}>
          Sort By Landing Time
        </Button>
      </Stack>
      {!!sortedFlightOptions && !_.isEmpty(sortedFlightOptions) ? (
        sortedFlightOptions.map((item, index) => (
          <Card key={index}>
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
            <Button
              onClick={() => handleFlightData(item, departureReturnDate.return)}
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
  );
};

export default FlightList;
