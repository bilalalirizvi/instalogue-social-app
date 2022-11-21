import React, { forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { openSnackBar } from "../store/slices/snackBarSlice";
import { Box } from "@mui/material";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {
  const _open = useSelector((state) => state.snackbar.status);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(openSnackBar(false));
  };

  return (
    <Box>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={_open} autoHideDuration={2000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Added!
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
}
