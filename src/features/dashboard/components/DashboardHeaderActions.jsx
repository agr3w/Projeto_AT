import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function DashboardHeaderActions({
  isAdmin,
  onOpenManagerPanel,
  onOpenNewTriagem,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Typography variant="h4" fontWeight={700} color="primary.main">
        Dashboard de Triagem
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        {isAdmin && (
          <Button
            color="secondary"
            variant="contained"
            startIcon={<BarChartIcon />}
            onClick={onOpenManagerPanel}
          >
            Acessar Painel Gestor
          </Button>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onOpenNewTriagem}
        >
          Nova Triagem
        </Button>
      </Box>
    </Box>
  );
}
