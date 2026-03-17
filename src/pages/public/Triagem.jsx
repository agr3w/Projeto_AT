import { Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TriagemStepper from "../../sections/triagem/TriagemStepper";

const triagemTheme = createTheme({
  palette: {
    primary: {
      main: "#004b87",
    },
    secondary: {
      main: "#0080ff",
    },
  },
});

export default function Triagem() {
  return (
    <ThemeProvider theme={triagemTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <TriagemStepper />
      </Container>
    </ThemeProvider>
  );
}
