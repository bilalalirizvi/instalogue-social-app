import React from "react";
import { makeStyles } from "tss-react/mui";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const useStyles = makeStyles()((theme) => ({
  link: {
    width: "470px",
    height: "40px",
    backgroundColor: "rgb(250, 182, 7)",
    borderRadius: "10px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 0px 5px rgb(230,230,230)",
    textDecoration: "none",
    fontSize: "14px",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgb(250, 193, 45)",
    },
  },
}));

const ShowNotiUpdateProfile = () => {
  const { classes } = useStyles();

  return (
    <Link to="/updateprofile/edit" className={classes.link}>
      Click to update your profile.
    </Link>
  );
};

export default ShowNotiUpdateProfile;
