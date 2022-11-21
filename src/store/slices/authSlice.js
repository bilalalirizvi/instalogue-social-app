import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  user: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signin: (state, action) => {
      state.status = true;
      state.user = action.payload;
    },
    signout: (state) => {
      state = initialState;
    },
    update: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const { signin, signout, update } = authSlice.actions;

export default authSlice.reducer;
