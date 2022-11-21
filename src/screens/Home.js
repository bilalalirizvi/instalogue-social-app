import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { makeStyles } from "tss-react/mui";
import { HomePostCard, ShowNotiUpdateProfile } from "../components/index";
import { getDocs, getDoc, collection, db, doc } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { allPosts } from "../store/slices/globalPostsSlice";

const useStyles = makeStyles()((theme) => ({
  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(250,250,250)",
    padding: "80px 0px",
  },
  contentBody: {
    width: "470px",
  },
}));

const Home = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const posts = useSelector((_posts) => _posts.posts.posts);
  const auth = useSelector((_auth) => _auth.auth.user);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const posts = [];
      const querySnapshot = await getDocs(collection(db, "posts"));
      await Promise.all(
        querySnapshot.docs.map(async (_doc) => {
          const post = _doc.data();
          post.comments = await Promise.all(
            post.comments.map(async (x) => {
              const docRef = doc(db, "users", `${x.userId}`);
              const docSnap = await getDoc(docRef);
              const data = docSnap.data();
              return { ...x, ...data };
            })
          );
          post.liked = !!post.likes.find((x) => x === auth.uid);
          posts.push(post);
        })
      );
      dispatch(allPosts(posts));
    } catch (error) {
      console.log("Error from get docs:", error.message);
    }
  };
  return (
    <>
      <Box className={classes.container}>
        <Box className={classes.contentBody}>
          {auth?.displayName?.length !== 0 && !auth?.avatar && (
            <ShowNotiUpdateProfile />
          )}
          {posts &&
            posts.map((data, index) => {
              return <HomePostCard key={index} data={data} />;
            })}
        </Box>
      </Box>
    </>
  );
};

export default Home;
