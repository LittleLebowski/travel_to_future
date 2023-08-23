//MUI
import { Box, Paper } from "@mui/material";
//Componenets
import LocationBox from "../views/LocationBox";
import TripTypeRadioGroup from "../components/TripTypeRadioGroup";

function MainPage() {
  return (
    <Box p={8}>
      <Paper>
        <Box>
          <TripTypeRadioGroup />
          <LocationBox />
        </Box>
      </Paper>
    </Box>
  );
}

export default MainPage;
