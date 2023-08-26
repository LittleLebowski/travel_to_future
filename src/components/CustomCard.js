import { Box, Card, Stack, Typography } from "@mui/material";
import React from "react";
import { minuteToHour, timeFormatter } from "../helper/timeZoneHelper";

const CustomCard = ({
  onClickAction = () => null,
  item,
  departureReturnDate = null,
}) => {
  return (
    <Card
      onClick={() => onClickAction(item, departureReturnDate)}
      sx={{
        display: "flex",
        flexDirection: "row",
        padding: "24px",
        borderRadius: "14px",
        "&:hover": {
          cursor: "pointer",
          boxShadow: "0px 0px 25px 1px rgba(129,138,168,1)",
          transitionProperty: "all",
          transitionDuration: "0.5s",
        },
      }}
    >
      <Stack
        direction={"row"}
        spacing={4}
        borderRight={1}
        px={4}
        borderColor={"#DAE0E8"}
      >
        <Box>
          <Typography
            align="left"
            fontWeight={600}
            fontSize={14}
            color={"#687e94"}
          >
            {timeFormatter.format(item.departuretime) ?? "Unknown"}
          </Typography>

          <Typography
            align="left"
            fontWeight={600}
            fontSize={12}
            color={"#7d8a96"}
          >
            {item.departure}
          </Typography>
        </Box>
        <Box>
          <Box
            minHeight={"20px"}
            minWidth={"100px"}
            maxWidth={"400px"}
            borderBottom={1}
            borderColor={"#DAE0E8"}
          >
            <Typography align="center" fontSize={10} color={"#b7cce8"}>
              Direct
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            align="left"
            fontWeight={600}
            fontSize={14}
            color={"#687e94"}
          >
            {timeFormatter.format(item.arrivalTime) ?? "Unknown"}
          </Typography>

          <Typography
            align="left"
            fontWeight={600}
            fontSize={12}
            color={"#7d8a96"}
          >
            {item.destination}
          </Typography>
        </Box>
        <Box>
          <Typography
            align="left"
            fontWeight={600}
            fontSize={12}
            color={"#7d8a96"}
          >
            Flight Duration
          </Typography>
          <Typography fontWeight={800} fontSize={16} color={"#526A81"}>
            {minuteToHour(item.duration)}
          </Typography>
        </Box>
      </Stack>
      <Stack px={4}>
        <Typography align="left">{`Flight Price: ${item.fee}$`}</Typography>
      </Stack>
      {/* 
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
      } `}</Typography> */}
    </Card>
  );
};

export default CustomCard;
