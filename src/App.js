import { createTheme, ThemeProvider } from "@mui/material";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./config/Routes";

const theme = createTheme({});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes />
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
