import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/system";
import { makeStyles } from "tss-react/mui";
import logo from "../assets/images/logo.png";
import { Search } from "@mui/icons-material";
import { Avatar, Tooltip, Typography } from "@mui/material";
import { HiOutlineHome } from "react-icons/hi";
import { BiMessageSquareAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import { getDocs, collection, db, query, where } from "../config/firebase";
import { limit } from "firebase/firestore";
import { debounce } from "lodash";
import { AiOutlineMessage } from "react-icons/ai";

const useStyles = makeStyles()((theme) => ({
  navbar: {
    width: "100%",
    height: "60px",
    backgroundColor: "white",
    borderBottom: "1px solid rgb(235,235,235)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    position: "fixed",
    zIndex: 1,
  },
  searchBar: {
    backgroundColor: "rgb(239,239,239)",
    width: "270px",
    height: "40px",
    borderRadius: "5px ",
    display: "flex",
    alignItems: "center",
    padding: "0px 15px 0px 10px",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  searchView: {
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: "40px",
    right: "0px",
    boxShadow: "0px 1px 3px rgb(200,200,200)",
    maxHeight: "200px",
    overflowY: "auto",
  },
  searchViewCard: {
    width: "100%",
    height: "50px",
    padding: "0px 15px",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "rgb(250,250,250)",
    },
    borderBottom: "1px solid rgb(245,245,245)",
    cursor: "pointer",
  },
  userNotFound: {
    width: "100%",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid rgb(245,245,245)",
  },
  searchInput: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
  },
  menu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Navbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchDisplay, setSearchDisplay] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const { classes } = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    getAllusers(searchInput);
  }, [searchInput]);

  const getAllusers = useCallback(
    debounce(async (value) => {
      if (!value) {
        setAllUsers([]);
        return;
      }
      let users = [];
      const q = query(
        collection(db, "users"),
        where("displayName", ">=", value),
        where("displayName", "<", value + "\uf8ff"),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setAllUsers(users);
    }, 1000),
    []
  );

  useEffect(() => {
    if (searchInput) {
      setSearchDisplay(true);
    } else {
      setSearchDisplay(false);
    }
  }, [searchInput]);

  return (
    <Box className={classes.navbar}>
      <Box>
        <img src={logo} alt="Logo" width={110} />
      </Box>
      <Box className={classes.searchBar}>
        <Search sx={{ marginRight: "10px" }} />
        <input
          className={classes.searchInput}
          type="search"
          placeholder="Search user"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Box className={classes.searchView}>
          {searchDisplay &&
            (allUsers.length ? (
              allUsers.map(({ displayName, avatar, userName }, index) => {
                return (
                  <Box
                    key={index}
                    className={classes.searchViewCard}
                    onClick={() => {
                      navigate(`profile/${userName}`);
                      setSearchInput("");
                    }}
                  >
                    <Avatar
                      src={avatar}
                      sx={{ width: "35px", height: "35px" }}
                    />
                    &nbsp; &nbsp;
                    <Typography>{displayName}</Typography>
                  </Box>
                );
              })
            ) : (
              <Box className={classes.userNotFound}>
                <Typography>Not found</Typography>
              </Box>
            ))}
        </Box>
      </Box>
      <Box className={classes.menu}>
        <Tooltip title="Home">
          <>
            <HiOutlineHome
              style={{ fontSize: "30px", color: "rgb(120,120,120)" }}
              onClick={() => navigate("/home")}
            />
          </>
        </Tooltip>
        <Tooltip title="Messages">
          <>
            <AiOutlineMessage
              style={{
                fontSize: "30px",
                color: "rgb(120,120,120)",
                marginLeft: "12px",
              }}
              onClick={() => navigate("/messages")}
            />
          </>
        </Tooltip>
        <Tooltip title="Add Photos">
          <>
            <BiMessageSquareAdd
              style={{
                fontSize: "30px",
                color: "rgb(120,120,120)",
                marginLeft: "12px",
              }}
              onClick={() => navigate("/newpost")}
            />
          </>
        </Tooltip>
        <AccountMenu />
      </Box>
    </Box>
  );
};

export default Navbar;
