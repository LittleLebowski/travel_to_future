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
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const DateBox = ({ hasReturnTrip, departureReturnDate, handleDateChange }) => {
  const [anchorElCalendarPopper, setAnchorElCalendarPopper] = useState(null);
  const [openCalendarPopper, setOpenCalendarPopper] = useState(false);

  const handlePopperClick = useCallback((event) => {
    setAnchorElCalendarPopper(event.currentTarget);
    setOpenCalendarPopper((previousOpen) => !previousOpen);
  }, []);

  return (
    <Stack px={2}>
      <ClickAwayListener onClickAway={() => setOpenCalendarPopper(false)}>
        <Box
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <Box
            onClick={handlePopperClick}
            bgcolor={"#E8E8E8"}
            height={56}
            minWidth={126}
          >
            {hasReturnTrip ? (
              <Stack
                direction={"row"}
                spacing={2}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box
                  display="flex"
                  flexDirection={"column"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography>Departure Date</Typography>
                  {departureReturnDate.departure ? (
                    <Typography>
                      {departureReturnDate?.departure.toDateString() ?? "-"}
                    </Typography>
                  ) : (
                    <CalendarTodayOutlinedIcon />
                  )}
                </Box>

                <Box
                  display="flex"
                  flexDirection={"column"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography>Return Date</Typography>
                  {departureReturnDate.return ? (
                    <Typography>
                      {departureReturnDate?.return.toDateString() ?? "-"}
                    </Typography>
                  ) : (
                    <CalendarTodayOutlinedIcon />
                  )}
                </Box>
              </Stack>
            ) : (
              <Stack
                display="flex"
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography>Departure</Typography>
                {departureReturnDate.departure ? (
                  <Typography>{departureReturnDate.departure}</Typography>
                ) : (
                  <CalendarTodayOutlinedIcon />
                )}
              </Stack>
            )}
          </Box>
          <Popper
            disablePortal
            open={openCalendarPopper}
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
        </Box>
      </ClickAwayListener>
    </Stack>
  );
};

export default DateBox;
