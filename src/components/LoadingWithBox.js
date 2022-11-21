import React from "react";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";

const LoadingWithBox = ({ width, height }) => {
  return (
    <Box
      sx={{
        width: width,
        height: height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="inherit" size={30} />
    </Box>
  );
};

export default LoadingWithBox;
