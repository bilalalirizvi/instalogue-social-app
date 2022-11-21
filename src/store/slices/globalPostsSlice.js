import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

export const globalPostsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    allPosts: (state, action) => {
      state.posts = action.payload;
    },
    comment: (state, action) => {
      state.posts
        .find((x) => x.postId === action.payload.postId)
        .comments.push(action.payload.comment);
    },
    like: (state, action) => {
      const postIndex = state.posts.findIndex(
        (x) => x.postId === action.payload.postId
      );
      if (state.posts[postIndex].liked) {
        state.posts[postIndex].likes.pop();
      } else {
        state.posts[postIndex].likes.push("");
      }
      state.posts[postIndex].liked = !state.posts[postIndex].liked;
    },
  },
});

export const { allPosts, comment, like } = globalPostsSlice.actions;

export default globalPostsSlice.reducer;
