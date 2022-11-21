import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: {},
};

export const profileDataSlice = createSlice({
  name: "currentUserposts",
  initialState,
  reducers: {
    currentUserPosts: (state, action) => {
      state.posts = action.payload;
    },
    postDelete: (state, action) => {
      state.posts.postsRef = state.posts.postsRef.filter(
        (x) => x.postId !== action.payload
      );
    },
  },
});

export const { currentUserPosts, postDelete } = profileDataSlice.actions;

export default profileDataSlice.reducer;
