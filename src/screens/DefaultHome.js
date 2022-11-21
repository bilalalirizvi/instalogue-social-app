import React from "react";
import { Navbar } from "../components/index";
import { Outlet } from "react-router-dom";
import SinglePost from "./SinglePost";
import { useDispatch, useSelector } from "react-redux";

const DefaultHome = () => {
  const postDialog = useSelector((_postDialog) => _postDialog.postDialog);

  return (
    <>
      {postDialog.status && <SinglePost />}
      <Navbar />
      <Outlet />
    </>
  );
};

export default DefaultHome;
