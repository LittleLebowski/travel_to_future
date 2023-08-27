import {
  Box,
  Card,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

import React from "react";

import { minuteToHour, timeFormatter } from "../helper/timeZoneHelper";

import CustomButton from "./CustomButton";

import SendIcon from "@mui/icons-material/Send";

import { SMALL_SCREEN_SIZE } from "../enums/screenSizing";

const CustomCard = ({
  onClickAction = () => null,
  item,
  departureReturnDate = null,
  selectButton = false,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(
    theme.breakpoints.down(SMALL_SCREEN_SIZE)
  );

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        gap: isSmallScreen ? 2 : "none",
        padding: isSmallScreen ? 1 : 3,
        borderRadius: "14px",
        "&:hover": {
          cursor: "default",
          boxShadow: "0px 0px 25px 1px rgba(129,138,168,1)",
          transitionProperty: "all",
          transitionDuration: "0.5s",
        },
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        spacing={4}
        sx={{
          paddingBottom: isSmallScreen ? 2 : 0,
          borderRight: isSmallScreen ? "none" : "1px solid #DAE0E8",
          borderBottom: isSmallScreen ? "1px solid #DAE0E8" : "none",
          paddingRight: isSmallScreen ? 0 : 2,
        }}
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
        <Box flex={1}>
          <Box
            display={"flex"}
            minHeight={"20px"}
            width={"100%"}
            borderBottom={1}
            borderColor={"#DAE0E8"}
            justifyContent={"center"}
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
      <Stack
        spacing={4}
        direction={"row"}
        display={"flex"}
        justifyContent={"space-between"}
        flex={1}
        sx={{
          paddingLeft: isSmallScreen ? 0 : 2,
        }}
      >
        <Stack display={"flex"} flex={1} alignItems={"stretch"}>
          <Box
            display={"flex"}
            gap={1}
            color={"#687e94"}
            flex={1}
            alignItems={"center"}
          >
            <Typography align="left" fontWeight={600} fontSize={14}>
              Flight Price: {item.fee}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            gap={1}
            color={"#687e94"}
            flex={1}
            alignItems={"center"}
          >
            <Typography align="left" fontWeight={600} fontSize={14}>
              Airline: {item.airline}
            </Typography>
          </Box>
        </Stack>
        {selectButton && (
          <Stack display={"flex"} justifyContent={"center"}>
            <CustomButton
              text={"Select"}
              style={{ borderRadius: 1, backgroundColor: "#526A81" }}
              border={2}
              hoverColor={"#91bfed"}
              onClick={() => onClickAction(item, departureReturnDate)}
              endIcon={<SendIcon sx={{ color: "#FFFFFF" }} />}
            />
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default CustomCard;
