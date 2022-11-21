import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
};

export const snackBarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    openSnackBar: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { openSnackBar } = snackBarSlice.actions;

export default snackBarSlice.reducer;
