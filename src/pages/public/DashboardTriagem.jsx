import { Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  DashboardFilters,
  DashboardGridSection,
  DashboardHeaderActions,
  useDashboardTriagemController,
} from "../../features/dashboard";

const dashboardTheme = createTheme({
  palette: {
    primary: {
      main: "#004b87",
    },
    secondary: {
      main: "#0080ff",
    },
  },
});

export default function DashboardTriagem() {
  const { headerProps, filtersProps, gridProps } = useDashboardTriagemController();

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <DashboardHeaderActions {...headerProps} />
        <DashboardFilters {...filtersProps} />
        <DashboardGridSection {...gridProps} />
      </Container>
    </ThemeProvider>
  );
}
