export function calculateArrivalTime(
  departureTime,
  departureTimezone,
  flightDurationHours,
  arrivalTimezone
) {
  // Convert departure time to timestamp in milliseconds
  const departureTimestamp = departureTime.getTime();

  // Calculate departure timezone offset in minutes
  const departureTimezoneOffset = departureTimezone * 60;

  // Calculate flight duration in milliseconds
  const flightDurationMillis = flightDurationHours * 60 * 60 * 1000;

  // Calculate arrival timestamp in milliseconds
  const arrivalTimestamp = departureTimestamp + flightDurationMillis;

  // Calculate arrival timezone offset in minutes
  const arrivalTimezoneOffset = arrivalTimezone * 60;

  // Calculate the total timezone offset difference
  const timezoneOffsetDifference =
    arrivalTimezoneOffset - departureTimezoneOffset;

  // Calculate the arrival time in destination's local time
  const arrivalTime = new Date(
    arrivalTimestamp + timezoneOffsetDifference * 60 * 1000
  );

  return arrivalTime;
}

export function createCustomDateTime(initialDate, customTime, customTimezone) {
  // Extract the date portion (year, month, day)
  const year = initialDate.getFullYear();
  const month = initialDate.getMonth();
  const day = initialDate.getDate();

  // Combine custom time and custom timezone
  const customDateTimeString = `${year}-${
    month + 1
  }-${day} ${customTime}${customTimezone}`;

  // Parse the custom formatted string into a Date object
  const customDateObject = new Date(customDateTimeString);

  return customDateObject;
}

const timeOptions = {
  hour12: true,
  hour: "2-digit",
  minute: "2-digit",
};

export const timeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);

export const minuteToHour = (min) => {
  const hours = Math.floor(min / 60);
  const mins = min % 60;

  const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;

  return `${hoursStr}h ${minsStr}m`;
};
