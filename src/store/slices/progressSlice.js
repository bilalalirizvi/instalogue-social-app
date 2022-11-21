import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
};

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    progress: (state) => {
      state.status = !state.status;
    },
  },
});

export const { progress } = progressSlice.actions;

export default progressSlice.reducer;
