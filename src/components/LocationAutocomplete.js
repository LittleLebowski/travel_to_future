//MUI
import { Autocomplete, TextField } from "@mui/material";

const LocationAutocomplite = ({
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
      renderInput={(params) => (
        <TextField
          variant="filled"
          margin="none"
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
