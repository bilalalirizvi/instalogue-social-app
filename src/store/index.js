import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import postReducer from "../store/slices/postCommentSlice";
import globalPostsReducer from "./slices/globalPostsSlice";
import snackBarReducer from "./slices/snackBarSlice";
import postDialogReducer from "./slices/postDialogSlice";
import profileDataReducer from "./slices/profileDataSlice";
import progressReducer from "./slices/progressSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    postComment: postReducer,
    posts: globalPostsReducer,
    snackbar: snackBarReducer,
    postDialog: postDialogReducer,
    currentUserPosts: profileDataReducer,
    progress: progressReducer,
  },
});

export default store;
