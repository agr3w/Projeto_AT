import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            VendPago | Triagem AT
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="body2" fontWeight={600}>
              {user?.nome || "Usuario"}
            </Typography>
            <Button
              color="inherit"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderColor: "rgba(255,255,255,0.5)", color: "common.white" }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ p: 3, minHeight: "calc(100vh - 64px)" }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
