import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { TriagemStepper } from "../../features/triagem";

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
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={triagemTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
          >
            Voltar ao Dashboard
          </Button>
        </Box>
        <TriagemStepper />
      </Container>
    </ThemeProvider>
  );
}
