//MUI
import { Autocomplete, TextField } from "@mui/material";
//
import _ from "lodash";

const LocationAutocomplite = ({
  errorKey,
  handleErrorObject,
  errorValue,
  value,
  handleFunction,
  label,
  options,
  dataLoading,
  waitingText = "Waiting for options to load",
}) => {
  return (
    <Autocomplete
      options={options}
      disableClearable
      getOptionLabel={(option) => option.label}
      value={value}
      onChange={(_e, v) => handleFunction(v)}
      loading={dataLoading}
      loadingText={waitingText}
      fullWidth
      renderInput={(params) => (
        <TextField
          variant="filled"
          margin="none"
          onBlur={() => handleErrorObject(errorKey, _.isEmpty(value))}
          error={errorValue}
          helperText={errorValue ? "Field cannot be empty" : ""}
          label={label}
          inputProps={{
            ...params.inputProps,
            style: {
              padding: "calc(0.5vw + 5px)",
              fontSize: "calc(0.5vw + 5px)",
              border: "none",
            },
          }}
          {...params}
        />
      )}
    />
  );
};

export default LocationAutocomplite;
