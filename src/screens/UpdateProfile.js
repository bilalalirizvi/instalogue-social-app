import React, { useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { NavLink, Outlet } from "react-router-dom";
import { FaLastfmSquare } from "react-icons/fa";

const useStyles = makeStyles()((theme) => ({
  container: {
    width: "100%",
    height: "100vh",
    backgroundColor: "rgb(250,250,250)",
    padding: "90px 60px 30px 60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      padding: "90px 10px 30px 10px",
    },
  },
  body: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    border: "1px solid rgb(235,235,235)",
    display: "flex",
    flexDirection: "row",
  },
  leftSide: {
    width: "250px",
    height: "100%",
    borderRight: "1px solid rgb(235,235,235)",
    "& .active": {
      borderLeft: "2px solid black",
      marginLeft: "-2px",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  sidebarNavLink: {
    textDecoration: "none",
    color: "rgb(39,41,80)",
    width: "100%",
    height: "50px",
    display: "flex",
    alignItems: "center",
    padding: "0px 20px",
    fontSize: "16px",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "rgb(250,250,250)",
    },
  },
  rightSide: {
    flex: 1,
    height: "100%",
    padding: "30px 20px",
  },
  active: {
    borderLeft: "2px solid black",
  },
}));

const UpdateProfile = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.body}>
        <Box className={classes.leftSide}>
          <NavLink to="/updateprofile/edit" className={classes.sidebarNavLink}>
            Edit Profile
          </NavLink>
          {/* <NavLink
            to="/updateprofile/changepassword"
            className={classes.sidebarNavLink}
          >
            Change Password
          </NavLink> */}
        </Box>
        <Box className={classes.rightSide}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateProfile;
