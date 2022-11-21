import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/system";
import { makeStyles } from "tss-react/mui";
import { Avatar, Typography } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile, BsTrash } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import TimeAgo from "react-timeago";
import { useDispatch, useSelector } from "react-redux";
import {
  postDialogBoxClose,
  comment,
  like as likeAction,
} from "../store/slices/postDialogSlice";
import { postDelete } from "../store/slices/profileDataSlice";
import {
  db,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "../config/firebase";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles()((theme) => ({
  container: {
    width: "100%",
    height: "100vh",
    top: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.6)",
    [theme.breakpoints.down("sm")]: {
      minHeight: "100vh",
      // padding: "20px 0px",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
  },
  // wrap: {
  //   width: "100%",
  //   height: "100vh",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   position: "relative",
  //   [theme.breakpoints.down("sm")]: {
  //     minHeight: "100vh",
  //   },
  // },
  closeIcon: {
    position: "absolute",
    top: 30,
    right: 30,
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
    cursor: "pointer",
  },
  box: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  imageBox: {
    width: "400px",
    height: "450px",
    backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      width: "350px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "auto",
    },
  },
  image: {
    width: "100%",
    height: "auto",
  },
  content: {
    width: "400px",
    height: "450px",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      width: "350px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  header: {
    width: "100%",
    height: "60px",
    borderBottom: "1px solid rgb(235,235,235)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 15px",
  },
  body: {
    width: "100%",
    flex: 1,
    overflowY: "auto",
  },
  commentTextCard: {
    width: "100%",
    padding: "0px 15px",
    minHeight: "60px",
    display: "flex",
    alignItems: "center",
  },
  commentText: {
    fontSize: "14px",
    //   padding: "10px 0px",
  },
  footerUp: {
    width: "100%",
    borderTop: "1px solid rgb(235,235,235)",
    display: "flex",
    flexDirection: "column",
    padding: "10px 15px",
    position: "relative",
  },
  likeShareComment: {
    width: " 100%",
    display: "flex",
    // padding: "15px 15px",
    marginBottom: "5px",
  },
  likeShareCommentIcons: {
    fontSize: "20px",
    marginRight: "15px",
  },
  likeIcon: {
    fontSize: "22px",
    marginRight: "15px",
  },
  likeIconFill: {
    fontSize: "22px",
    marginRight: "15px",
    color: "rgb(214,0,0)",
  },
  howManyLikes: {
    // padding: "0px 15px",
    marginBottom: "5px",
  },
  howManyLikesText: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#262626",
  },
  descriptionBox: {
    // padding: "0px 15px",
    marginBottom: "5px",
  },
  descriptionText: {
    fontSize: "14px",
    color: "#262626",
  },
  timeAgoBox: {
    // padding: "0px 15px",
    // marginBottom: "5px",
  },
  timeAgoText: {
    fontSize: "10px",
    color: "rgb(145,145,145)",
  },
  footerBottom: {
    width: "100%",
    height: "60px",
    borderTop: "1px solid rgb(235,235,235)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 15px",
  },
  commentBoxInput: {
    width: "100%",
    height: "100%",
    padding: "0px 15px",
    border: "none",
    outline: "none",
  },
  commentBoxBtn: {
    backgroundColor: "transparent",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  emojiPicker: {
    width: "100%",
    position: "absolute",
    bottom: "55px",
    left: "0px",
  },
  postMenu: {
    position: "absolute",
    width: "150px",
    backgroundColor: "white",
    boxShadow: "0px 0px 2px black",
    top: "15px",
    left: "-150px",
  },
  postMenuItem: {
    width: "100%",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgb(250,250,250)",
    },
  },
}));

const SinglePost = () => {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postComment, setPostComment] = useState("");
  const [commentBtn, setCommentBtn] = useState(true);
  const [displayMenu, setDisplayMenu] = useState(false);
  const {
    postId,
    url,
    displayName,
    avatar,
    comments,
    userName,
    likes,
    description,
    createdOn,
    liked,
    uid,
  } = useSelector((state) => state.postDialog.postContent);
  const auth = useSelector((state) => state.auth.user);
  const messagesEndRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (postComment) {
      setCommentBtn(false);
    } else {
      setCommentBtn(true);
    }
  }, [postComment]);

  const addCommentInDb = async () => {
    setShowEmojiPicker(false);
    const ref = doc(db, "posts", `${postId}`);
    const _comment = {
      time: Date.now(),
      text: postComment,
      userId: auth.uid,
    };
    await updateDoc(ref, {
      comments: arrayUnion(_comment),
    });
    dispatch(comment({ ..._comment, ...auth }));
    setPostComment("");
  };

  const like = async () => {
    const ref = doc(db, "posts", `${postId}`);
    await updateDoc(ref, {
      likes: liked ? arrayRemove(auth.uid) : arrayUnion(auth.uid),
    });
    dispatch(likeAction(auth.uid));
  };

  const deletePost = async () => {
    try {
      await deleteDoc(doc(db, "posts", `${postId}`));
      const ref = doc(db, "users", `${uid}`);
      await updateDoc(ref, {
        postsRef: arrayRemove(postId),
      });
      dispatch(postDelete(postId));
      dispatch(postDialogBoxClose());
    } catch (error) {
      console.log("Error from Data Delete:", error.message);
    }
  };

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <Box className={classes.container}>
      {/* <Box className={classes.wrap}> */}
      <MdClose
        className={classes.closeIcon}
        onClick={() => dispatch(postDialogBoxClose())}
      />
      <Box className={classes.box}>
        <Box className={classes.imageBox}>
          <img className={classes.image} src={url} alt="" />
        </Box>
        <Box className={classes.content}>
          <Box className={classes.header}>
            <Box>
              <Avatar alt="User" src={avatar} sx={{ width: 30, height: 30 }} />
            </Box>
            <Box sx={{ flex: 1, marginLeft: "10px" }}>{displayName}</Box>
            <Box style={{ position: "relative" }}>
              {auth.uid === uid && (
                <BiDotsHorizontalRounded
                  style={{ cursor: "pointer" }}
                  onClick={() => setDisplayMenu(!displayMenu)}
                />
              )}
              {displayMenu && (
                <Box className={classes.postMenu}>
                  <Box className={classes.postMenuItem} onClick={deletePost}>
                    <BsTrash /> &nbsp;
                    <Typography sx={{ fontSize: "13px" }}>
                      Delete Post
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* COMMENT */}
          <Box className={classes.body}>
            {comments &&
              comments.map(({ avatar, displayName, text, userName }, index) => {
                return (
                  <Box key={index} className={classes.commentTextCard}>
                    <Avatar
                      alt="User "
                      src={avatar}
                      sx={{
                        width: 30,
                        height: 30,
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        dispatch(postDialogBoxClose());
                        navigate(`profile/${userName}`);
                      }}
                    />
                    <Typography className={classes.commentText}>
                      <b>{displayName}</b> {text}
                    </Typography>
                    <Box ref={messagesEndRef} />
                  </Box>
                );
              })}
          </Box>

          {/* FOOTER TOP */}
          <Box className={classes.footerUp}>
            {/* LIKE, COMMENT, SHARE */}
            <Box className={classes.likeShareComment}>
              {liked ? (
                <RiHeartFill className={classes.likeIconFill} onClick={like} />
              ) : (
                <RiHeartLine className={classes.likeIcon} onClick={like} />
              )}

              {/* COMMENT */}
              <FaRegComment className={classes.likeShareCommentIcons} />

              {/* SHARE */}
              <FiSend className={classes.likeShareCommentIcons} />
            </Box>

            {/* VIEW LIKES */}
            <Box className={classes.howManyLikes}>
              {likes.length !== 0 && likes.length === 1
                ? `${likes.length} like`
                : `${likes.length} likes`}
            </Box>

            {/* VIEW CAPTION */}
            <Box className={classes.descriptionBox}>
              {description && (
                <Typography className={classes.descriptionText}>
                  <b>{displayName || userName}</b> {description}
                </Typography>
              )}
            </Box>

            {/* CREATED ON */}
            <Box className={classes.timeAgoBox}>
              <Typography className={classes.timeAgoText}>
                <TimeAgo date={createdOn} />
              </Typography>
            </Box>
          </Box>

          {/* FOOTER BOTTOM */}
          <Box className={classes.footerBottom}>
            {showEmojiPicker && (
              <Box className={classes.emojiPicker}>
                <EmojiPicker
                  width={"100%"}
                  onEmojiClick={({ emoji }) => {
                    setPostComment((_comment) => _comment + emoji);
                  }}
                />
              </Box>
            )}
            <BsEmojiSmile
              style={{ fontSize: "25px" }}
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
              }}
            />
            <input
              className={classes.commentBoxInput}
              type="text"
              placeholder="Add a comment..."
              value={postComment}
              onChange={(e) => setPostComment(e.target.value)}
            />
            <button
              disabled={commentBtn}
              className={classes.commentBoxBtn}
              style={{
                color: commentBtn ? "rgb(194,226,252)" : "rgb(68,149,246)",
              }}
              onClick={addCommentInDb}
            >
              Post
            </button>
          </Box>
        </Box>
      </Box>
      {/* </Box> */}
    </Box>
  );
};

export default SinglePost;
