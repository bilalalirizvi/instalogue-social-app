import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { makeStyles } from "tss-react/mui";
import { Avatar, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  db,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  getUrl,
} from "../config/firebase";
import { Progress } from "../components";
import { useDispatch } from "react-redux";
import { postDialogBox } from "../store/slices/postDialogSlice";
import { currentUserPosts } from "../store/slices/profileDataSlice";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

const useStyle = makeStyles()((theme) => ({
  container: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "rgb(250,250,250)",
    padding: "60px 0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  profileHeaderWrap: {
    width: "60%",
    height: "180px",
    borderBottom: "1px solid rgb(220,220,220)",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  profilePicture: {
    padding: "0px 30px",
  },
  profileAvatar: {
    width: 120,
    height: 120,
    [theme.breakpoints.down("sm")]: {
      width: "80px",
      height: "80px",
    },
  },
  userName: { fontSize: "20px", fontWeight: 600 },
  editProfileBtn: {
    margin: "10px 0px",
    padding: "5px 10px",
    backgroundColor: "transparent",
    borderRadius: "3px",
    border: "1px solid rgb(220,220,220)",
    fontWeight: 600,
    cursor: "pointer",
  },
  posts: {},
  profileBody: {
    marginTop: "30px",
    width: "90%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: "5px",
  },
  profileCard: {
    width: "300px",
    height: "300px",
    cursor: "pointer",
    position: "relative",
    "&:hover .hoverPreview": {
      display: "flex",
    },
  },
  hoverPreview: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: "0px",
    left: "0px",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "none",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: "18px",
  },
  profileCardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const Profile = () => {
  const { profileId } = useParams();
  const { classes } = useStyle();
  const dispatch = useDispatch();

  const {
    auth: {
      user: { userName, uid },
    },
  } = useSelector((state) => state);

  const userData = useSelector((state) => state.currentUserPosts.posts);
  const [hoverPreview, setHoverPreview] = useState(false);

  // FIND AND GET USER WITH USERNAME
  const getSingleUser = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("userName", "==", profileId)
      );
      const querySnapshot = await getDocs(q);
      const _userData = querySnapshot.docs[0].data();

      const postsRef = await Promise.all(
        _userData?.postsRef?.map(async (_postId) => {
          const docRef = doc(db, "posts", `${_postId}`);
          const docSnap = await getDoc(docRef);
          const post = docSnap.data();
          post.comments = await Promise.all(
            post.comments.map(async (x) => {
              const docRef = doc(db, "users", `${x.userId}`);
              const docSnap = await getDoc(docRef);
              const data = docSnap.data();
              return { ...x, ...data };
            })
          );
          post.url = await getUrl(_postId);
          return post;
        }) || []
      );
      dispatch(currentUserPosts({ ..._userData, postsRef }));
    } catch (error) {
      console.log("Error in profile:", error.message);
    }
  };

  useEffect(() => {
    getSingleUser();
  }, [profileId]);

  return (
    <Box className={classes.container}>
      {userData?.userName ? (
        <>
          <Box className={classes.profileHeaderWrap}>
            <Box className={classes.profilePicture}>
              <Avatar
                alt="Profile Picture"
                src={userData.avatar}
                className={classes.profileAvatar}
              />
            </Box>
            <Box className={classes.profile}>
              <Typography className={classes.userName}>
                {userData.displayName || userData.userName}
              </Typography>
              {userData?.userName === userName && (
                <Link
                  to="/updateprofile/edit"
                  style={{ textDecoration: "none", marginRight: "10px" }}
                >
                  <button className={classes.editProfileBtn}>
                    Edit Profile
                  </button>
                </Link>
              )}
              {userData?.userName !== userName && (
                <Link
                  to={`/messages/${userData?.uid}`}
                  style={{ textDecoration: "none" }}
                >
                  <button
                    // onClick={() => messageHandle(userData.userName)}
                    className={classes.editProfileBtn}
                  >
                    Message
                  </button>
                </Link>
              )}
              <Box className={classes.posts}>{`${userData?.postsRef?.length} ${
                userData?.postsRef?.length > 1 ? "Posts" : "Post"
              }`}</Box>
            </Box>
          </Box>
          <Box className={classes.profileBody}>
            {userData?.postsRef?.map((x, i) => {
              return (
                <Paper
                  key={i}
                  className={classes.profileCard}
                  onClick={() => {
                    dispatch(
                      postDialogBox({
                        ...x,
                        ...userData,
                        postsRef: [],
                        currentAuth: uid,
                      })
                    );
                  }}
                  style={{
                    backgroundImage: `url(${x.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onMouseEnter={() => setHoverPreview(true)}
                  onMouseLeave={() => setHoverPreview(false)}
                >
                  <Box className={`${classes.hoverPreview} hoverPreview`}>
                    <AiFillHeart style={{ marginRight: "2px" }} />
                    {x.likes.length} &nbsp;&nbsp;&nbsp;
                    <FaComment style={{ marginRight: "3px" }} />
                    {x.comments.length}
                  </Box>
                  {/* <img
                    className={classes.profileCardImg}
                    src={x.url}
                    alt="Post"
                  /> */}
                </Paper>
              );
            })}
          </Box>
        </>
      ) : (
        <Box sx={{ marginTop: "200px" }}>
          <Progress />
        </Box>
      )}
    </Box>
  );
};

export default Profile;
