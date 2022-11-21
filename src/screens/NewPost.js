import React, { useState, useEffect } from "react";
import "../styles/newPost.css";
import { Avatar, Box, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import {
  uploadBytes,
  uploadFileFn,
  db,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "../config/firebase";
import { Progress } from "../components/index";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import swal from "sweetalert";

const useStyles = makeStyles()((theme) => ({
  createPostContainer: {
    width: "100%",
    height: "100vh",
    backgroundColor: "rgb(250,250,250)",
    padding: "80px 0px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headingText: {
    fontSize: "20px",
    fontWeight: "500",
    marginBottom: "20px",
    textAlign: "center",
  },
  createPostBox: {
    maxWidth: "350px",
    width: "100vw",
    backgroundColor: "white",
    border: "1px solid rgb(235,235,235)",
    borderRadius: "10px",
    // padding: "20px",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
  },
  createPostTextBox: {
    width: "100%",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid rgb(235,235,235)",
  },
  avatarAndNameBox: {
    width: "100%",
    padding: "10px 15px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  avatarAndNameText: {
    marginLeft: "10px",
    fontSize: "14px",
    fontWeight: 600,
  },
  descriptionInputBox: { width: "100%", padding: "0px 15px" },
  descriptionInput: {
    width: "100%",
    height: "80px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "rgb(150,150,150)",
    resize: "none",
  },
  emojiPickerBox: {
    width: "100%",
    padding: "10px 15px",
    textAlign: "right",
    position: "relative",
  },
  emojiPicker: {
    width: "100%",
    position: "absolute",
    bottom: "40px",
    left: "0px",
  },
  mediaFileBox: { width: "100%", padding: "0px 15px", marginBottom: "10px" },
  fileBtn: {
    width: "90px",
    height: "30px",
    borderRadius: "5px",
    backgroundColor: "rgb(239,239,239)",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "14px",
  },
  postBtnBox: { width: "100%", padding: "10px 15px", marginBottom: "10px" },
  postBtn: {
    width: "100%",
    height: "35px",
    borderRadius: "5px",
    border: "none",
    outline: "none",
    fontWeight: "bold",
    color: "white",
  },
}));

const NewPost = () => {
  const [progress, setProgress] = useState(false);
  const [postBtn, setPostBtn] = useState(true);
  const [caption, setCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState("");
  const { classes } = useStyles();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (file) {
      setPostBtn(false);
    } else {
      setPostBtn(true);
    }
  }, [file]);

  const uploadFile = async () => {
    setProgress(true);

    const checkImageType = file?.type?.includes("image/");
    const checkVideoType = file?.type?.includes("video/");
    if (checkImageType || checkVideoType) {
      try {
        const id = uuidv4();
        await uploadBytes(uploadFileFn(id), file);
        await setDoc(doc(db, "posts", `${id}`), {
          userId: auth?.user?.uid,
          postId: id,
          createdOn: Date.now(),
          description: caption,
          comments: [],
          likes: [],
        });
        const ref = doc(db, "users", auth?.user?.uid);
        await updateDoc(ref, {
          postsRef: arrayUnion(id),
        });
        setFile("");
        setCaption("");
        swal("Successfuly added!");
      } catch (error) {
        console.log("Upload File Error:", error.message);
      }
    } else {
      swal("Invalid file type!");
    }

    setProgress(false);
  };

  return (
    <Box className={classes.createPostContainer}>
      <Typography className={classes.headingText}>
        Share photos and videos using <br /> Instalogue posts!
      </Typography>
      <Box className={classes.createPostBox}>
        <Box className={classes.createPostTextBox}>
          <Typography>Create post</Typography>
        </Box>
        <Box className={classes.avatarAndNameBox}>
          <Avatar
            alt="Profile Picture"
            src={auth?.user?.avatar}
            sx={{ width: 30, height: 30 }}
          />
          <Typography className={classes.avatarAndNameText}>
            {auth.user.displayName || auth.user.userName}
          </Typography>
        </Box>
        <Box className={classes.descriptionInputBox}>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            type="text"
            className={classes.descriptionInput}
            placeholder="Write a caption...."
            autoFocus
          ></textarea>
        </Box>
        <Box className={classes.emojiPickerBox}>
          <BsEmojiSmile
            style={{ fontSize: "25px" }}
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
            }}
          />
          {showEmojiPicker && (
            <Box className={classes.emojiPicker}>
              <EmojiPicker
                width={"100%"}
                height={"320px"}
                onEmojiClick={({ emoji }) => {
                  setShowEmojiPicker(false);
                  setCaption((_comment) => _comment + emoji);
                }}
              />
            </Box>
          )}
        </Box>
        <Box className={classes.mediaFileBox}>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            accept="image/*,video/*"
            hidden
            id="actual-btn"
          />
          <label htmlFor="actual-btn" className={classes.fileBtn}>
            Choose File
          </label>
          &nbsp;
          <span>{file ? file?.name.slice(0, 30) : "No file chosen"}</span>
        </Box>
        <Box className={classes.postBtnBox}>
          <button
            onClick={uploadFile}
            // disabled={file}
            className={classes.postBtn}
            style={{
              backgroundColor: postBtn ? "rgb(194,226,252)" : "rgb(68,149,246)",
              color: postBtn ? "rgb(150,150,150)" : "white",
            }}
          >
            {progress ? <Progress /> : "Post"}
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default NewPost;
