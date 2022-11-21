import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import {
  Signin,
  Signup,
  DefaultHome,
  Home,
  NewPost,
  Profile,
  Settings,
  UpdateProfile,
  EditProfile,
  Messages,
} from "../screens/index";
import {
  auth,
  userState,
  db,
  doc,
  getDoc,
  getDocs,
  collection,
} from "../config/firebase";
import { Loading } from "../components/index";
import { useDispatch } from "react-redux";
import { signin, signout } from "../store/slices/authSlice";
import { allPosts } from "../store/slices/globalPostsSlice";

const _Routes = () => {
  const [isUserSignin, setIsUserSignin] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const getCurrentUserFromStore = () => {
    userState(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", `${user.uid}`);
        const docSnap = await getDoc(docRef);
        dispatch(
          signin(JSON.parse(JSON.stringify({ ...user, ...docSnap.data() })))
        );

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
            post.liked = !!post.likes.find((x) => x === user.uid);
            posts.push(post);
          })
        );
        dispatch(allPosts(posts));
        setIsUserSignin(true);
      } else {
        // User is signed out
        dispatch(signout());
        setIsUserSignin(false);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getCurrentUserFromStore();
  }, []);

  return (
    <Routes>
      <Route element={loading ? <Loading /> : <Outlet />}>
        {isUserSignin ? (
          <>
            <Route path="/" element={<DefaultHome />}>
              <Route index element={<Home />} />
              <Route path="newpost" element={<NewPost />} />
              <Route path="profile">
                <Route path=":profileId" element={<Profile />} />
              </Route>
              <Route path="settings" element={<Settings />} />
              <Route path="updateprofile" element={<UpdateProfile />}>
                <Route index path="edit" element={<EditProfile />} />
                <Route path="changepassword" element={<EditProfile />} />
              </Route>
              <Route path="messages" element={<Messages />}>
                <Route index path=":receiverUid" element={<Messages />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="signin" />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

export default _Routes;
