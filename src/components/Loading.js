import React from "react";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const useStyles = makeStyles()((theme) => ({
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Loading = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Box sx={{ display: "flex" }}>
        <CircularProgress color="inherit" />
      </Box>
    </Box>
  );
};

export default Loading;
