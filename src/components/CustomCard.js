import { Box, Card, Stack, Typography } from "@mui/material";
import React from "react";
import { minuteToHour, timeFormatter } from "../helper/timeZoneHelper";
import CustomButton from "./CustomButton";
import SendIcon from "@mui/icons-material/Send";

const CustomCard = ({
  onClickAction = () => null,
  item,
  departureReturnDate = null,
  selectButton = false,
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        padding: "24px",
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
      <Stack
        pl={4}
        spacing={4}
        direction={"row"}
        display={"flex"}
        justifyContent={"space-between"}
        flex={1}
      >
        <Stack>
          <Box display={"flex"} flexDirection={"row"} gap={1} color={"#687e94"}>
            <Typography align="left" fontWeight={600} fontSize={14} noWrap>
              Flight Price: {item.fee}
            </Typography>
          </Box>
          <Box display={"flex"} flexDirection={"row"} gap={1} color={"#687e94"}>
            <Typography align="left" fontWeight={600} fontSize={14} noWrap>
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
