// Mui
import { CircularProgress, Stack } from "@mui/material";

export function FullScreenLoader({ noOpacity = false }) {
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      position={"absolute"}
      top={0}
      bottom={0}
      left={0}
      right={0}
      width={"100%"}
      height={"100%"}
      bgcolor={noOpacity ? "white" : "rgba(255,255,255,0.8)"}
    >
      <CircularProgress />
    </Stack>
  );
}

function LazyListener({ listen, children }) {
  return (
    <>
      {children}
      {listen ? <FullScreenLoader /> : undefined}
    </>
  );
}

export default LazyListener;
