import React from "react";
import { Box } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";

const FullScreenProgress = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: "0px",
        left: "opx",
      }}
    >
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center   ",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    </Box>
  );
};

export default FullScreenProgress;
