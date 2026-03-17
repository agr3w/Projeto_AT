import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useAlert } from "../../contexts/useAlert";

const loginTheme = createTheme({
  palette: {
    primary: {
      main: "#004b87",
    },
    secondary: {
      main: "#0080ff",
    },
  },
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = login(email.trim(), senha);

    if (!result.success) {
      showAlert(result.message, "error");
      return;
    }

    showAlert("Login realizado com sucesso.", "success");
    navigate("/");
  };

  return (
    <ThemeProvider theme={loginTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "radial-gradient(1200px 600px at 80% -10%, #4da6ff 0%, #0b4f8a 42%, #052d52 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          px: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.16)",
            top: -120,
            left: -90,
            filter: "blur(2px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            bgcolor: "rgba(0,128,255,0.35)",
            bottom: -90,
            right: -70,
            filter: "blur(4px)",
          }}
        />

        <Container maxWidth="md">
          <Paper
            elevation={16}
            sx={{
              width: "100%",
              borderRadius: 4,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                background: "linear-gradient(155deg, #f5fbff 0%, #e7f2ff 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: 2, color: "primary.main", fontWeight: 700 }}
                >
                  SISTEMA DE TRIAGEM
                </Typography>
                <Typography variant="h3" fontWeight={800} color="primary.main" lineHeight={1.1}>
                  VendPago
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1.5}>
                  Plataforma para acompanhamento de triagens, diagnosticos e produtividade da
                  assistencia tecnica.
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="caption" color="text.secondary">
                  Perfis de acesso
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Gestor (admin) e Operador
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "common.white" }}>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                Entrar na conta
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5} mb={2}>
                Use suas credenciais para continuar.
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                />
                <TextField
                  fullWidth
                  label="Senha"
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ mt: 1, py: 1.3, fontWeight: 700 }}
                >
                  Entrar
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
