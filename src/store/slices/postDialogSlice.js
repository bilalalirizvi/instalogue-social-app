import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  postContent: {},
};

export const postDialog = createSlice({
  name: "postdialog",
  initialState,
  reducers: {
    postDialogBox: (state, action) => {
      state.status = true;
      state.postContent = action.payload;
      state.postContent.liked = !!action.payload.likes.find(
        (x) => x === action.payload.currentAuth
      );
    },
    postDialogBoxClose: (state) => {
      state.status = false;
      state.postContent = {};
    },
    comment: (state, action) => {
      state.postContent.comments.push(action.payload);
    },
    like: (state) => {
      if (state.postContent.liked) {
        state.postContent.likes.pop();
      } else {
        state.postContent.likes.push("");
      }
      state.postContent.liked = !state.postContent.liked;
    },
  },
});

export const { postDialogBox, postDialogBoxClose, comment, like } =
  postDialog.actions;

export default postDialog.reducer;
