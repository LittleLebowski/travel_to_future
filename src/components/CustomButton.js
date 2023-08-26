import { Button, Typography } from "@mui/material";
import React from "react";

const CustomButton = ({ text, hoverColor, style, border = null, ...rest }) => {
  return (
    <Button
      {...rest}
      sx={[
        {
          "&:hover": {
            backgroundColor: hoverColor,
            border: `${border} solid ${hoverColor}`,
          },
        },
        { ...style },
      ]}
    >
      <Typography fontSize={10} fontWeight={600} color={"white"}>
        {text}
      </Typography>
    </Button>
  );
};

export default CustomButton;
