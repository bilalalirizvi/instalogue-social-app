import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Box } from "@mui/system";
import { makeStyles } from "tss-react/mui";
import { Avatar, Typography } from "@mui/material";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { FiSend } from "react-icons/fi";
import chatlogo from "../assets/images/chatlogo.png";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  db,
  arrayUnion,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const useStyles = makeStyles()((theme) => ({
  container: {
    width: "100%",
    height: "100vh",
    padding: "60px 0px 0px 0px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  usersBox: {
    borderRight: "1px solid rgb(235,235,235)",
    width: "320px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      width: "280px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex !important",
    },
  },
  arrowBack: {
    cursor: "pointer",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  userSearchBox: {
    width: "100%",
    height: "60px",
    borderBottom: "1px solid rgb(235,235,235)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px 20px",
    "& input": {
      width: "100%",
      height: "35px",
      padding: "0px 15px",
      outline: "none",
      border: "1px solid rgb(235,235,235)",
      borderRadius: "5px",
    },
  },
  userChatBox: {
    flex: 1,
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  chatItems: {
    width: "100%",
    height: "70px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "0px 20px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgb(239,239,239)",
    },
  },
  chatBox: {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      display: "flex !important",
    },
  },
  header: {
    width: "100%",
    height: "60px",
    borderBottom: "1px solid rgb(235,235,235)",
    display: "flex",
    alignItems: "center",
    padding: "0px 20px ",
  },
  chatBody: {
    flex: 1,
    padding: "20px",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  currentUser: {
    minWidth: "200px",
    maxWidth: "500px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "rgb(239,239,239)",
    position: "relative",
  },
  rowRight: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
    position: "relative",
    "&::after": {
      content: '""',
      width: "20px",
      height: "20px",
      backgroundColor: "rgb(239,239,239)",
      position: "absolute",
      top: "15px",
      right: "-8px",
      transform: "rotate(45deg)",
    },
  },
  secondUser: {
    minWidth: "200px",
    maxWidth: "500px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "rgb(239,239,239)",
    position: "relative",
  },
  rowLeft: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "10px",
    position: "relative",
    "&::after": {
      content: '""',
      width: "20px",
      height: "20px",
      backgroundColor: "rgb(239,239,239)",
      position: "absolute",
      top: "15px",
      left: "-8px",
      transform: "rotate(45deg)",
    },
  },
  footer: {
    width: "100%",
    height: "90px",
    borderTop: "1px solid rgb(235,235,235)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  messageInputWrap: {
    width: "90%",
    height: "50px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    border: "1px solid rgb(235,235,235)",
    borderRadius: "50px",
    padding: "0px 20px",
    "& input": {
      width: "100%",
      height: "100%",
      padding: "0px 10px",
      outline: "none",
      border: "none",
    },
  },
  emojiPicker: {
    width: "100%",
    position: "absolute",
    bottom: "50px",
    left: "0px",
  },
  emptyMessageScreen: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    [theme.breakpoints.up("sm")]: {
      display: "flex !important",
    },
  },
}));

const Messages = () => {
  const auth = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [receiverData, setReceiverData] = useState({});
  const { displayName, avatar, userName } = receiverData;
  const [userChat, setUserChat] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [screenActive, setScreenActive] = useState(false);
  const { classes } = useStyles();
  const { receiverUid } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const getReceiverData = async () => {
    try {
      const docRef = doc(db, "users", receiverUid);
      const docSnap = await getDoc(docRef);
      setReceiverData({ ...docSnap.data(), postsRef: [] });
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    if (receiverUid) {
      getReceiverData();
    }
  }, [receiverUid]);

  const getUserChat = async () => {
    const _chatRoomId = chatRoomId(auth.userName, receiverData.userName);
    const unsub = onSnapshot(doc(db, `message/${_chatRoomId}`), (doc) => {
      setUserChat(doc.data()?.messages || []);
    });
    return unsub;
  };

  useEffect(() => {
    if (receiverUid && receiverData.userName) {
      getUserChat();
    }
  }, [receiverUid, receiverData]);

  const chatRoomId = (currentUser, receiver) => {
    const [user1, user2] = [currentUser, receiver];
    return user1 < user2 ? user1.concat(user2) : user2.concat(user1);
  };

  const getAllChatRooms = () => {
    const q = query(
      collection(db, "message"),
      where("users", "array-contains", auth.userName)
    );
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const chatRooms = [];
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const chat = doc.data();
          const _receiverUserName =
            chat.users[0] === auth.userName ? chat.users[1] : chat.users[0];
          const que = query(
            collection(db, "users"),
            where("userName", "==", _receiverUserName)
          );
          const docSnap = await getDocs(que);
          chat.receiver = docSnap.docs[0].data();
          chatRooms.push(chat);
        })
      );
      setChatRooms(chatRooms);
    });
    return unsubscribe;
  };

  useEffect(() => {
    getAllChatRooms();
  }, []);

  const messageHandle = async () => {
    const _chatRoomId = chatRoomId(auth.userName, receiverData.userName);
    setMessage("");
    try {
      if (message.trim()) {
        const chatObj = {
          sender: auth?.userName,
          timestamp: Date.now(),
          text: message,
          read: {
            [auth?.userName]: false,
            [userName]: false,
          },
        };
        const obj = {
          users: [auth.userName, receiverData.userName],
          chatRoomId: _chatRoomId,
          messages: [chatObj],
        };

        const docRef = doc(db, "message", _chatRoomId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, {
            messages: arrayUnion(chatObj),
          });
        } else {
          await setDoc(docRef, obj);
        }
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  // scroll caht in bottom
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <Box className={classes.container}>
      <Box
        className={classes.usersBox}
        style={{ display: screenActive ? "none" : "flex" }}
      >
        <Box className={classes.userSearchBox}>
          <input
            type="search"
            placeholder="Search user by name..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </Box>
        <Box className={classes.userChatBox}>
          {chatRooms
            .filter(({ receiver: { displayName } }) =>
              displayName.toLowerCase().includes(searchVal.toLowerCase())
            )
            .map(({ receiver: { avatar, displayName, uid } }, index) => {
              return (
                <Box
                  key={index}
                  className={classes.chatItems}
                  onClick={() => {
                    navigate(`/messages/${uid}`);
                    setScreenActive(true);
                    setSearchVal("");
                  }}
                >
                  <Avatar
                    src={avatar}
                    sx={{ width: 45, height: 45, cursor: "pointer" }}
                  />
                  &nbsp;&nbsp; <Typography>{displayName}</Typography>
                </Box>
              );
            })}
        </Box>
      </Box>
      {receiverData && receiverUid ? (
        <Box
          className={classes.chatBox}
          style={{ display: screenActive ? "flex" : "none" }}
        >
          <Box className={classes.header}>
            <AiOutlineArrowLeft
              className={classes.arrowBack}
              style={{ fontSize: "20px", marginRight: "10px" }}
              onClick={() => setScreenActive(false)}
            />
            <Avatar
              src={avatar}
              sx={{ width: 45, height: 45, cursor: "pointer" }}
              onClick={() => navigate(`/profile/${userName}`)}
            />
            &nbsp;&nbsp;
            <Typography>{displayName}</Typography>
          </Box>
          <Box className={classes.chatBody}>
            {userChat &&
              userChat.map(({ sender, text, timestamp }) => {
                return sender === auth.userName ? (
                  <Box key={timestamp} className={classes.rowRight}>
                    <Box className={classes.currentUser}>
                      <Typography>{text}</Typography>
                      <Typography
                        sx={{
                          position: "absolute",
                          bottom: "5px",
                          right: "8px",
                          fontSize: "13px",
                        }}
                      >
                        {moment(timestamp).format("h:m a")}
                      </Typography>
                    </Box>
                    <Box ref={messagesEndRef} />
                  </Box>
                ) : (
                  <Box key={timestamp} className={classes.rowLeft}>
                    <Box className={classes.secondUser}>
                      <Typography>{text}</Typography>
                      <Typography
                        sx={{
                          position: "absolute",
                          bottom: "5px",
                          right: "8px",
                          fontSize: "13px",
                        }}
                      >
                        11:23 pm
                      </Typography>
                    </Box>
                    <Box ref={messagesEndRef} />
                  </Box>
                );
              })}
          </Box>
          <Box className={classes.footer}>
            <Box className={classes.messageInputWrap}>
              <BsEmojiSmile
                style={{ fontSize: "30px" }}
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                }}
              />
              {showEmojiPicker && (
                <Box className={classes.emojiPicker}>
                  <EmojiPicker
                    width={"100%"}
                    height={"400px"}
                    onEmojiClick={({ emoji }) => {
                      setShowEmojiPicker(false);
                      setMessage((_comment) => _comment + emoji);
                    }}
                  />
                </Box>
              )}
              <input
                type="text"
                placeholder="message..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <FiSend
                style={{ fontSize: "25px", opacity: "0.7" }}
                onClick={messageHandle}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          className={classes.emptyMessageScreen}
          style={{ display: screenActive ? "flex" : "none" }}
        >
          <img
            src={chatlogo}
            alt="Chat"
            width="120px"
            height="auto"
            style={{ opacity: "0.5" }}
          />
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "rgb(178,184,245)",
            }}
          >
            Your Messages
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Messages;
