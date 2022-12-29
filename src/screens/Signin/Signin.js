import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import logo from "../../assets/images/logo.png";
import appleapp from "../../assets/images/appleapp.png";
import androidapp from "../../assets/images/androidapp.png";
import { makeStyles } from "tss-react/mui";
import { Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  provider,
  setDoc,
  getDoc,
  doc,
  db,
} from "../../config/firebase";
import { Progress } from "../../components/index";
import swal from "sweetalert";

const useStyles = makeStyles()((theme) => ({
  loginContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(250, 250, 250)",
    padding: "30px",
  },
  loginBox: {
    width: 350,
    height: 400,
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid rgb(220,220,220)",
    backgroundColor: "rgb(255,255,255)",
    paddingRight: "40px",
    paddingLeft: "40px",
    paddingBottom: "30px",
    paddingTop: "30px",
  },
  logoImage: {
    width: "200px",
    height: "auto",
  },
  input: {
    width: "100%",
    height: "35px",
    padding: "0px 15px",
    borderRadius: "3px",
    border: "1px solid rgb(220,220,220)",
  },
  button: {
    width: "100%",
    height: "35px",
    backgroundColor: "rgb(68,149,246)",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "3px",
  },
  loginWith: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  forgotPass: {
    fontSize: "13px",
    cursor: "pointer",
    color: "rgb(56,81,133)",
  },
  dontHaveAcc: {
    width: 350,
    height: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid rgb(220,220,220)",
    backgroundColor: "rgb(255,255,255)",
    marginTop: "10px",
  },
  aTag: {
    textDecoration: "none",
    marginRight: "20px",
    color: "rgb(157,145,145)",
  },
}));

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signinBtn, setSigninBtn] = useState(true);
  const [progress, setProgress] = useState(false);

  const { classes } = useStyles();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  useEffect(() => {
    if (validateEmail(email) && password.length >= 8) {
      setSigninBtn(false);
    } else {
      setSigninBtn(true);
    }
  }, [email, password]);

  const signinSubmit = async () => {
    setProgress(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("user:", user);
      swal("Successfuly Sign In!");
    } catch (error) {
      const errorMessage = error.message;
      console.log("errorMessage:", errorMessage);
    }
    setProgress(false);
  };

  const createUser = async (uid, fName) => {
    try {
      await setDoc(doc(db, "users", `${uid}`), {
        displayName: fName,
        uid,
        userName: `${fName.toLowerCase().replace(" ", "")}-${uid.slice(0, 6)}`,
      });
    } catch (error) {
      console.log("error:", error.message);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const docRef = doc(db, "users", `${uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        await createUser(uid, result.user.displayName);
      }

      swal(`Welcome ${result.user.displayName}`);
    } catch (error) {
      swal(error.message);
    }
  };

  return (
    <>
      <Box className={classes.loginContainer}>
        <Box className={classes.loginBox}>
          <img className={classes.logoImage} src={logo} alt="Instgram" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={classes.input}
            type="email"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={classes.input}
            type="password"
            placeholder="Password"
          />
          <button
            onClick={signinSubmit}
            className={classes.button}
            style={{
              backgroundColor: signinBtn
                ? "rgb(188,223,252)"
                : "rgb(68,149,246)",
            }}
          >
            {progress ? <Progress /> : "Login"}
          </button>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <hr style={{ flex: 1, borderTop: "1px solid rgb(220,220,220)" }} />
            &nbsp; OR &nbsp;
            <hr style={{ flex: 1, borderTop: "1px solid rgb(220,220,220)" }} />
          </Box>
          <Box className={classes.loginWith} onClick={signInWithFacebook}>
            <FacebookIcon fontSize="medium" sx={{ color: "rgb(56,81,133)" }} />
            &nbsp;
            <Typography
              sx={{
                fontSize: "14px",
                color: "rgb(56,81,133)",
                fontWeight: "bold",
              }}
            >
              Log in with Facebook
            </Typography>
          </Box>
          <Typography className={classes.forgotPass}>
            Forgot password?
          </Typography>
        </Box>
        <Box className={classes.dontHaveAcc}>
          <Typography sx={{ fontSize: "14px" }}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </Typography>
        </Box>
        <Typography
          sx={{ fontSize: "14px", marginTop: "20px", marginBottom: "20px" }}
        >
          Get the app
        </Typography>
        <Box sx={{ marginBottom: "20px" }}>
          <img
            style={{ width: "130px", height: "40px" }}
            src={appleapp}
            alt=""
          />
          &nbsp;
          <img
            style={{ width: "130px", height: "40px" }}
            src={androidapp}
            alt=""
          />
        </Box>
        {/* <Box sx={{ fontSize: "12px" }}>
          <a className={classes.aTag} href="/">
            Meta
          </a>
          <a className={classes.aTag} href="/">
            About
          </a>
          <a className={classes.aTag} href="/">
            Blog
          </a>
          <a className={classes.aTag} href="/">
            Jobs
          </a>
          <a className={classes.aTag} href="/">
            Help
          </a>
          <a className={classes.aTag} href="/">
            API
          </a>
          <a className={classes.aTag} href="/">
            Privacy
          </a>
          <a className={classes.aTag} href="/">
            Terms
          </a>
          <a className={classes.aTag} href="/">
            Top Accounts
          </a>
          <a className={classes.aTag} href="/">
            Hashtags
          </a>
          <a className={classes.aTag} href="/">
            Locations
          </a>
          <a className={classes.aTag} href="/">
            Instagram Lite
          </a>
          <a className={classes.aTag} href="/">
            Contact Uploading & Non-Users
          </a>
        </Box> */}
        {/* <Box
          sx={{
            color: "rgb(157,145,145)",
            fontSize: "12px",
            marginTop: "20px",
          }}
        >
          English © 2022 Instagram from Meta
        </Box> */}
      </Box>
    </>
  );
};

export default Signin;
