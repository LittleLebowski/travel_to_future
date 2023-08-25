//React
import React, { useCallback, useMemo, useState } from "react";
//Third-Party
import ReactDatePicker from "react-datepicker";
//Css
import "react-datepicker/dist/react-datepicker.css";
//Enums
import { DEPARTURE, RETURN } from "../enums/datePickerEnums";

const currentDate = new Date();

const RangePicker = ({ hasReturnTrip, handleDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onDateChange = useCallback(
    (dates) => {
      console.log(dates);
      if (hasReturnTrip) {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        start && handleDateChange(DEPARTURE, start.toDateString());
        end && handleDateChange(RETURN, end.toDateString());
      } else {
        setStartDate(dates);
        dates && handleDateChange(DEPARTURE, dates.toDateString());
        handleDateChange(RETURN, "");
      }
    },
    [hasReturnTrip, handleDateChange]
  );

  const isLeapYear = useCallback((year) => {
    // Check if year is a leap year
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }, []);

  const maxDateToPick = useMemo(() => {
    const twoYearsLater = new Date();
    // Add 2 years
    twoYearsLater.setFullYear(currentDate.getFullYear() + 2);
    // Adjust the date if the resulting year is a leap year
    if (
      isLeapYear(twoYearsLater.getFullYear()) &&
      twoYearsLater.getMonth() > 1 &&
      twoYearsLater.getDate() > 28
    ) {
      twoYearsLater.setDate(29);
    }
    return twoYearsLater;
  }, [isLeapYear]);

  return hasReturnTrip ? (
    <ReactDatePicker
      selected={startDate}
      onChange={onDateChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      selectsDisabledDaysInRange
      minDate={currentDate}
      maxDate={maxDateToPick}
      inline
      monthsShown={2}
      renderCustomHeader={({
        //Below code is to present two month at the same time
        monthDate,
        customHeaderCount,
        decreaseMonth,
        increaseMonth,
      }) => (
        <div>
          <button
            aria-label="Previous Month"
            className={
              "react-datepicker__navigation react-datepicker__navigation--previous"
            }
            style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
            onClick={decreaseMonth}
          >
            <span
              className={
                "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
              }
            >
              {"<"}
            </span>
          </button>
          <span className="react-datepicker__current-month">
            {monthDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            aria-label="Next Month"
            className={
              "react-datepicker__navigation react-datepicker__navigation--next"
            }
            style={customHeaderCount === 0 ? { visibility: "hidden" } : null}
            onClick={increaseMonth}
          >
            <span
              className={
                "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
              }
            >
              {">"}
            </span>
          </button>
        </div>
      )}
    />
  ) : (
    <ReactDatePicker
      minDate={currentDate}
      maxDate={maxDateToPick}
      selected={startDate}
      onChange={onDateChange}
      inline
    />
  );
};

export default RangePicker;
