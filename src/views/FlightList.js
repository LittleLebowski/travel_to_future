//React
import React, { useCallback, useMemo, useState } from "react";
//MUI
import { Box, Stack, Typography, useTheme } from "@mui/material";
//Third-Party
import _ from "lodash";
//Components
import CustomCard from "../components/CustomCard";
import CustomButton from "../components/CustomButton";
//Icons
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const FlightList = ({
  flightOptions,
  handleFlightData,
  departureReturnDate,
}) => {
  const [sortingOptions, setSortingOptions] = useState({
    isAscending: false,
    sortBy: null,
  });

  const theme = useTheme();

  const buttonIconSelector = useCallback((isAscending) => {
    return isAscending ? (
      <KeyboardArrowUpRoundedIcon sx={{ color: "#FFFFFF" }} />
    ) : (
      <KeyboardArrowDownRoundedIcon sx={{ color: "#FFFFFF" }} />
    );
  }, []);

  const handleSortingOptions = useCallback((sortBy) => {
    setSortingOptions((prevState) => {
      let sortingValue =
        sortBy === prevState.sortBy ? !prevState.isAscending : false;
      return { ...prevState, isAscending: sortingValue, sortBy: sortBy };
    });
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

  const buttonIcons = useMemo(() => {
    return buttonIconSelector(sortingOptions.isAscending);
  }, [buttonIconSelector, sortingOptions]);

  return (
    <Stack borderRadius={3}>
      <Stack
        direction={"row-reverse"}
        borderRadius={theme.spacing(1.3, 1.3, 0, 0)}
        spacing={1}
        p={1}
        bgcolor={"#526a81"}
      >
        <CustomButton
          endIcon={sortingOptions.sortBy === "duration" ? buttonIcons : null}
          style={{ borderColor: "#E8E8E8", borderRadius: 1 }}
          border={2}
          hoverColor={"#91bfed"}
          variant="outlined"
          onClick={() => handleSortingOptions("duration")}
          text={"Sort By Flight Duration"}
        />

        <CustomButton
          style={{ borderColor: "#E8E8E8", borderRadius: 1 }}
          endIcon={
            sortingOptions.sortBy === "departuretime" ? buttonIcons : null
          }
          border={2}
          hoverColor={"#91bfed"}
          variant="outlined"
          onClick={() => handleSortingOptions("departuretime")}
          text={"Sort By Departure Time"}
        />

        <CustomButton
          style={{ borderColor: "#E8E8E8", borderRadius: 1 }}
          endIcon={sortingOptions.sortBy === "arrivalTime" ? buttonIcons : null}
          border={2}
          hoverColor={"#91bfed"}
          variant="outlined"
          onClick={() => handleSortingOptions("arrivalTime")}
          text={"Sort By Landing Time"}
        />
      </Stack>
      <Stack
        gap={3}
        py={2}
        px={4}
        borderRadius={theme.spacing(0, 0, 1.3, 1.3)}
        border={6}
        borderTop={0}
        borderColor={"#526A81"}
      >
        {!!sortedFlightOptions && !_.isEmpty(sortedFlightOptions) ? (
          sortedFlightOptions.map((item, index) => (
            <CustomCard
              key={index}
              onClickAction={handleFlightData}
              item={item}
              departureReturnDate={departureReturnDate.return}
              selectButton={true}
            />
          ))
        ) : (
          <Box
            minHeight={"30vh"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography fontWeight={600} color={"#697684"} fontSize={18}>
              There Are No Flights Available On This Day
            </Typography>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default FlightList;
