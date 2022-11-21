import * as React from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

function SimpleDialog(props) {
  const { onClose, open, comments } = props;
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        All Comments &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &ensp; &ensp;
      </DialogTitle>
      <List sx={{ pt: 0, borderTop: "1px solid rgb(200,200,200)" }}>
        {comments.map(
          ({ text, avatar, displayName, time, userName }, index) => (
            <ListItem
              key={index}
              onClick={() => {
                navigate(`profile/${userName}`);
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={avatar}
                  sx={{ bgcolor: blue[100], color: blue[600] }}
                  title={displayName}
                >
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText title={new Date(time)} primary={text} />
            </ListItem>
          )
        )}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default function ViewCommentDialog({ comments }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Typography
        onClick={handleClickOpen}
        sx={{ fontSize: "14px", color: "rgb(145,145,145)", cursor: "pointer" }}
      >
        {comments.length === 1 && `View 1 comment`}
        {comments.length > 1 && `View all ${comments.length} comments`}
      </Typography>
      <SimpleDialog comments={comments} open={open} onClose={handleClose} />
    </Box>
  );
}
