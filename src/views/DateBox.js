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
  useMediaQuery,
  useTheme,
} from "@mui/material";
//Components
import RangePicker from "../components/RangePicker";
//Icons
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import { SMALL_SCREEN_SIZE } from "../enums/screenSizing";

const DateBox = ({
  hasReturnTrip,
  departureReturnDate,
  handleDateChange,
  errorObject,
}) => {
  const [anchorElCalendarPopper, setAnchorElCalendarPopper] = useState(null);
  const [openCalendarPopper, setOpenCalendarPopper] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(
    theme.breakpoints.down(SMALL_SCREEN_SIZE)
  );

  const handlePopperClick = useCallback((event) => {
    setAnchorElCalendarPopper(event.currentTarget);
    setOpenCalendarPopper((previousOpen) => !previousOpen);
  }, []);

  const handleClickAway = useCallback(() => {
    setOpenCalendarPopper(false);
  }, []);

  const headerText = useCallback((title) => {
    return (
      <Typography
        align="left"
        noWrap
        fontSize={14}
        fontWeight={600}
        color={"#687e94"}
      >
        {title}
      </Typography>
    );
  }, []);

  return (
    <Stack p={2} flex={1}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box display={"flex"} flexDirection={"column"} flex={1}>
          <Box
            borderBottom={errorObject.return || errorObject.departure ? 1 : 0}
            borderColor={"red"}
            onClick={handlePopperClick}
            bgcolor={"#E8E8E8"}
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
            flex={1}
            maxHeight={56}
            minHeight={56}
            sx={{
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#e6e3e3",
              },
            }}
            borderRadius={1}
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
            sx={{ zIndex: 3000, width: isSmallScreen ? "244px" : "none" }}
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

          {(errorObject.departure || errorObject.return) && (
            <Typography
              mt={"3px"}
              ml={"14px"}
              variant="caption"
              color={"#d32f2f"}
            >
              Select flight date
            </Typography>
          )}
        </Box>
      </ClickAwayListener>
    </Stack>
  );
};

export default DateBox;
