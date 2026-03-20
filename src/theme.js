import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0A3469",
    },
    secondary: {
      main: "#0072E5",
    },
    background: {
      default: "#F4F6F8",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "0px 4px 14px rgba(10, 52, 105, 0.18)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "none",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "none",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

export default theme;
