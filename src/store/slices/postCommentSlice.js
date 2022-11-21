import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const postCommentSlice = createSlice({
  name: "postComment",
  initialState,
  reducers: {
    comment: (state, action) => {
      return action.payload;
    },
  },
});

export const { comment } = postCommentSlice.actions;

export default postCommentSlice.reducer;
