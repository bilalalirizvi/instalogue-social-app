import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { makeStyles } from "tss-react/mui";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import { Avatar, Typography } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import TimeAgo from "react-timeago";
import { ViewCommentDialog, LoadingWithBox, SnackBar } from "./index";
import {
  getUrl,
  db,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
} from "../config/firebase";
import { useSelector, useDispatch } from "react-redux";
import { openSnackBar } from "../store/slices/snackBarSlice";
import { comment, like as likeAction } from "../store/slices/globalPostsSlice";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles()((theme) => ({
  cardContainer: {
    width: " 100%",
    backgroundColor: "white",
    border: "1px solid rgb(235,235,235)",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  header: {
    width: " 100%",
    height: "55px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 15px",
  },
  snapWrap: {
    width: " 100%",
  },
  snap: {
    width: " 100%",
    height: "auto",
  },
  likeShareComment: {
    width: " 100%",
    display: "flex",
    padding: "15px 15px",
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
    padding: "0px 15px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#262626",
    marginBottom: "5px",
  },
  descriptionBox: {
    padding: "0px 15px",
    marginBottom: "5px",
  },
  descriptionText: {
    fontSize: "14px",
    color: "#262626",
  },
  viewAllCommentsBox: {
    padding: "0px 15px",
    marginBottom: "5px",
  },
  viewAllCommentsText: {
    fontSize: "14px",
    color: "rgb(145,145,145)",
  },
  timeAgoBox: {
    padding: "0px 15px",
    marginBottom: "5px",
  },
  timeAgoText: {
    fontSize: "10px",
    color: "rgb(145,145,145)",
  },
  commentBox: {
    width: " 100%",
    height: "55px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 15px",
    borderTop: "1px solid rgb(235,235,235)",
    position: "relative",
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
}));

const HomePostCard = ({ data }) => {
  const { description, likes, comments, createdOn, postId, userId, liked } =
    data;
  const state = useSelector((state) => state);
  const [commentBtn, setCommentBtn] = useState(true);
  const [postComment, setPostComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [postCreater, setPostCreater] = useState({});
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (postComment) {
      setCommentBtn(false);
    } else {
      setCommentBtn(true);
    }
  }, [postComment]);

  useEffect(() => {
    getPostDetail();
    getImageUrl();
  }, [data]);

  const getPostDetail = async () => {
    const docRef = doc(db, "users", `${userId}`);
    const docSnap = await getDoc(docRef);
    setPostCreater(docSnap.data());
  };

  const getImageUrl = async () => {
    const url = await getUrl(postId);
    setImageUrl(url);
  };

  const addCommentInDb = async () => {
    setShowEmojiPicker(false);
    const ref = doc(db, "posts", `${postId}`);
    const _comment = {
      time: Date.now(),
      text: postComment,
      userId: state.auth.user.uid,
    };
    await updateDoc(ref, {
      comments: arrayUnion(_comment),
    });
    dispatch(
      comment({
        postId,
        comment: { ..._comment, ...state.auth.user },
      })
    );
    setPostComment("");
    dispatch(openSnackBar(true));
  };

  const like = async () => {
    const ref = doc(db, "posts", `${postId}`);
    await updateDoc(ref, {
      likes: liked
        ? arrayRemove(state.auth.user.uid)
        : arrayUnion(state.auth.user.uid),
    });
    dispatch(
      likeAction({
        postId,
      })
    );
  };

  return (
    <>
      <SnackBar />
      <Box className={classes.cardContainer}>
        {/* HEADER AVATAR AND NAME */}
        <Box className={classes.header}>
          <Box>
            <Avatar
              onClick={() => navigate(`profile/${postCreater.userName}`)}
              alt="User"
              src={postCreater?.avatar}
              sx={{ width: 30, height: 30, cursor: "pointer" }}
            />
          </Box>
          <Box sx={{ flex: 1, marginLeft: "10px" }}>
            {postCreater?.displayName || postCreater?.userName}
          </Box>
          <Box>
            <BiDotsHorizontalRounded />
          </Box>
        </Box>

        {/* IMAGE WITH LOADING */}
        <Box className={classes.snapWrap}>
          {!imageUrl ? (
            <LoadingWithBox width={"100%"} height={"100px"} />
          ) : (
            <img className={classes.snap} src={imageUrl} alt="Snap" />
          )}
        </Box>

        {/* LIKE */}
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
              <b>{postCreater?.displayName || postCreater?.userName}</b>{" "}
              {description}
            </Typography>
          )}
        </Box>

        {/* VIEW ALL COMMENTS */}
        <Box className={classes.viewAllCommentsBox}>
          <Typography
            component={"span"}
            className={classes.viewAllCommentsText}
          >
            {comments.length !== 0 && <ViewCommentDialog comments={comments} />}
          </Typography>
        </Box>

        {/* CREATED ON */}
        <Box className={classes.timeAgoBox}>
          <Typography className={classes.timeAgoText}>
            <TimeAgo date={createdOn} />
          </Typography>
        </Box>

        {/* EMOJI PICKER */}
        <Box className={classes.commentBox}>
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
    </>
  );
};

export default HomePostCard;
