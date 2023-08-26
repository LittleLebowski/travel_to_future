//React
import React, { useCallback, useState } from "react";
//MUI
import {
  Box,
  ClickAwayListener,
  Fade,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
//Components
import RangePicker from "../components/RangePicker";
//Icons
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";

const DateBox = ({
  hasReturnTrip,
  departureReturnDate,
  handleDateChange,
  errorObject,
}) => {
  const [anchorElCalendarPopper, setAnchorElCalendarPopper] = useState(null);
  const [openCalendarPopper, setOpenCalendarPopper] = useState(false);

  const handlePopperClick = useCallback((event) => {
    setAnchorElCalendarPopper(event.currentTarget);
    setOpenCalendarPopper((previousOpen) => !previousOpen);
  }, []);

  const handleClickAway = useCallback(() => {
    setOpenCalendarPopper(false);
  }, []);

  const headerText = useCallback((title) => {
    return (
      <Typography align="left" noWrap fontWeight={600} color={"#687e94"}>
        {title}
      </Typography>
    );
  }, []);

  return (
    <Stack p={2}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <Box
            borderBottom={errorObject.return || errorObject.departure ? 1 : 0}
            borderColor={"red"}
            onClick={handlePopperClick}
            bgcolor={"#E8E8E8"}
            borderRadius={1}
            height={"64px"}
          >
            {hasReturnTrip ? (
              <Stack
                direction={"row"}
                spacing={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                p={1}
              >
                <Box
                  display="flex"
                  flexDirection={"column"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={1}
                >
                  {headerText("Departure")}

                  {departureReturnDate.departure ? (
                    <Typography
                      align="left"
                      noWrap
                      color={"#7d8a96"}
                      fontSize={12}
                    >
                      {departureReturnDate?.departure.toDateString() ?? "-"}
                    </Typography>
                  ) : (
                    ""
                  )}
                </Box>

                <SyncAltRoundedIcon sx={{ color: "#687e94" }} />

                <Box
                  display="flex"
                  flexDirection={"column"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={1}
                >
                  {headerText("Return")}
                  {departureReturnDate.return ? (
                    <Typography
                      align="left"
                      noWrap
                      color={"#7d8a96"}
                      fontSize={12}
                    >
                      {departureReturnDate?.return.toDateString() ?? "-"}
                    </Typography>
                  ) : (
                    ""
                  )}
                </Box>
              </Stack>
            ) : (
              <Stack
                display="flex"
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"center"}
                p={2}
              >
                {headerText("Departure")}
                {departureReturnDate.departure ? (
                  <Typography
                    align="left"
                    noWrap
                    color={"#7d8a96"}
                    fontSize={12}
                  >
                    {departureReturnDate.departure.toDateString() ?? "-"}
                  </Typography>
                ) : (
                  ""
                  // <CalendarTodayOutlinedIcon sx={{ color: "#687e94" }} />
                )}
              </Stack>
            )}
          </Box>
          <Popper
            disablePortal
            open={Boolean(openCalendarPopper)}
            anchorEl={anchorElCalendarPopper}
            placement={"bottom"}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={100}>
                <Paper elevation={1}>
                  <RangePicker
                    hasReturnTrip={hasReturnTrip}
                    handleDateChange={(key, value) =>
                      handleDateChange(key, value)
                    }
                  />
                </Paper>
              </Fade>
            )}
          </Popper>

          <Box minHeight={"24px"}>
            {/* minHeight is to evade moving of the box when there is an error  */}
            {errorObject.departure && (
              <Typography
                ml={"14px"}
                mt={"3px"}
                variant="caption"
                color={"#d32f2f"}
              >
                Select flight date
              </Typography>
            )}
          </Box>
        </Box>
      </ClickAwayListener>
    </Stack>
  );
};

export default DateBox;
