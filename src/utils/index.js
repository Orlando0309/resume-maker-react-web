import { createTheme } from "@mui/material";
export const BASE_URL = process.env.REACT_APP_API_URL;
export const  theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});