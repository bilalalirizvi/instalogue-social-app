import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { makeStyles } from "tss-react/mui";
import { Avatar } from "@mui/material";
import { Progress } from "../../components/index";
import { useDispatch, useSelector } from "react-redux";
import {
  db,
  doc,
  updateDoc,
  uploadBytes,
  uploadFileFn,
  getUrl,
} from "../../config/firebase";
import { v4 as uuidv4 } from "uuid";
import { update } from "../../store/slices/authSlice";

const useStyles = makeStyles()((theme) => ({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "20px",
  },
  columnLeft: {
    width: "120px",
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      width: "100px",
    },
  },
  columnRight: {
    flex: 1,
    padding: "0px 20px",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 0px 0px 20px",
    },
  },
  input: {
    width: "80%",
    height: "40px",
    border: "1px solid rgb(220,220,220)",
    outline: "none",
    borderRadius: "5px",
    padding: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  btnBox: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  submitBtn: {
    width: "200px",
    height: "40px",
    border: "none",
    borderRadius: "5px",
  },
  fileBtn: {
    width: "90px",
    height: "30px",
    borderRadius: "5px",
    backgroundColor: "rgb(239,239,239)",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "14px",
  },
  fileName: {
    [theme.breakpoints.down("sm")]: {
      display: "block",
      marginTop: "10px",
    },
    [theme.breakpoints.down("md")]: {
      display: "block",
      marginTop: "10px",
    },
  },
}));

const EditProfile = () => {
  const auth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(false);
  const [file, setFile] = useState("");
  const [displayName, setDisplayName] = useState(auth.displayName);
  const [userName, setUserName] = useState(auth.userName);
  const [submitBtn, setSubmitBtn] = useState(true);
  const { classes } = useStyles();

  useEffect(() => {
    if (file) {
      setSubmitBtn(false);
    } else {
      setSubmitBtn(true);
    }
  }, [file]);

  const submit = async () => {
    setProgress(true);
    try {
      // function
      let imageUrl = "";
      if (file) {
        // UPLOAD FILE IN STORAGE
        const id = uuidv4();
        await uploadBytes(uploadFileFn(id), file);
        // GET IMAGE LINK
        imageUrl = await getUrl(id);
      }
      const _update = {
        displayName: displayName,
        avatar: imageUrl || auth.avatar,
      };
      // UPDATE DATA
      const docRef = doc(db, "users", `${auth.uid}`);
      await updateDoc(docRef, _update);
      dispatch(update(_update));
      setFile("");
    } catch (error) {
      console.log("Error:", error.message);
    }
    setProgress(false);
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.row}>
        <Box className={classes.columnLeft}>
          <Avatar
            src={file ? window.URL.createObjectURL(file) : auth.avatar}
            sx={{ width: 70, height: 70 }}
          />
        </Box>
        <Box className={classes.columnRight}>
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
          <span className={classes.fileName}>
            {file ? file?.name.slice(0, 30) : "No file chosen"}
          </span>
        </Box>
      </Box>
      <Box className={classes.row}>
        <Box className={classes.columnLeft}>Display Name</Box>
        <Box className={classes.columnRight}>
          <input
            className={classes.input}
            type="text"
            placeholder="Enter display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </Box>
      </Box>
      <Box className={classes.row}>
        <Box className={classes.columnLeft}>User Name</Box>
        <Box className={classes.columnRight}>
          <input
            disabled
            className={classes.input}
            type="text"
            placeholder="Enter user name"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
        </Box>
      </Box>
      <Box className={classes.btnBox}>
        <button
          disabled={submitBtn}
          onClick={submit}
          className={classes.submitBtn}
          style={{
            backgroundColor: !submitBtn
              ? "rgb(68,149,246)"
              : "rgb(194,226,252)",
            color: !submitBtn ? "white" : "rgb(150,150,150)",
          }}
        >
          {progress ? <Progress /> : "Save"}
        </button>
      </Box>
    </Box>
  );
};

export default EditProfile;
